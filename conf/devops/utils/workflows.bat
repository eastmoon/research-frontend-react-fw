@rem ------------------- batch setting -------------------
@echo off

@rem ------------------- execute script -------------------
call :%*
goto end

@rem ------------------- declare variable -------------------

@rem ------------------- declare function -------------------
:do-dev-prepare
    echo ^> Create cache directory
    if NOT EXIST %CLI_DIRECTORY%\cache\develop\ (
        mkdir %CLI_DIRECTORY%\cache\develop
    )

    echo ^> Build image
    docker build --rm ^
        -t react.sdk:%PROJECT_NAME% ^
        %CLI_DIRECTORY%/conf/docker/react

    echo ^> Build virtual network
    set network_exist=1
    for /f "tokens=1" %%p in ('docker network ls --filter "name=%INFRA_DOCKER_NETWORK%" --format "{{.ID}}"') do (
        set network_exist=
    )
    if defined network_exist (docker network create %INFRA_DOCKER_NETWORK%)
    goto end

:do-dev-remove
    @rem Declare variable
    set DOCKER_CONTAINER_NAME=%1

    @rem Remove service
    for /f "tokens=1" %%p in ('docker ps -a --filter "name=%DOCKER_CONTAINER_NAME%" --format "{{.ID}}"') do (
        docker rm -f %%p
    )
    goto end

:do-dev
    @rem Declare variable
    set VAR_SRV_HOSTNAME=%1
    set VAR_SRV_STATE=%2
    set DOCKER_CONTAINER_NAME=%PROJECT_NAME%
    set DC_ENV=%CLI_DIRECTORY%\cache\docker-compose-dev.env
    set DC_CONF=%CLI_DIRECTORY%\conf\docker\docker-compose-dev.yml

    @rem management container
    if defined TARGET_PROJECT_STOP (
        echo Stop project %PROJECT_NAME% develop server
        if "%VAR_SRV_HOSTNAME%" == "all" (
            set stop_compose_ok=1
            IF not EXIST !DC_CONF! (
                echo !DC_CONF! not find.
                set stop_compose_ok=
            )
            IF not EXIST !DC_ENV! (
                echo !DC_ENV! not find.
                set stop_compose_ok=
            )
            if defined stop_compose_ok (
                docker compose --file !DC_CONF! --env-file !DC_ENV! down
            )
        ) else (
            call :do-dev-remove %DOCKER_CONTAINER_NAME%-%VAR_SRV_HOSTNAME%
        )
    ) else (
        echo Start project %PROJECT_NAME% develop server
        echo ^> Startup service
        call :do-dev-prepare

        echo ^> Start container with docker-compose
        IF EXIST !DC_CONF! (
            @rem create docker-compose env file
            IF EXIST !DC_ENV! (del !DC_ENV!)
            echo PROJECT_NAME=%PROJECT_NAME% > !DC_ENV!
            echo PROJECT_DIR=%CLI_DIRECTORY% >> !DC_ENV!
            echo INFRA_DOCKER_NETWORK=%INFRA_DOCKER_NETWORK% >> !DC_ENV!

            @rem website dev serverconfig
            echo WEB_IMAGE_NAME=react.sdk:%PROJECT_NAME% >> !DC_ENV!
            echo WEB_CONTAINER_NAME=%DOCKER_CONTAINER_NAME%-%TARGET_PROJECT_DEV_SERVER_HOSTNAME% >> !DC_ENV!
            echo WEB_PORT=%TARGET_PROJECT_DEV_SERVER_PORT% >> !DC_ENV!
            echo WEB_COMMAND=%TARGET_PROJECT_COMMAND% >> !DC_ENV!

            @rem storybook server config
            echo SB_IMAGE_NAME=react.sdk:%PROJECT_NAME% >> !DC_ENV!
            echo SB_CONTAINER_NAME=%DOCKER_CONTAINER_NAME%-%TARGET_PROJECT_STORYBOOK_SERVER_HOSTNAME% >> !DC_ENV!
            echo SB_PORT=%TARGET_PROJECT_STORYBOOK_SERVER_PORT% >> !DC_ENV!
            echo SB_COMMAND=sb >> !DC_ENV!

            @rem service dev server config
            echo SVC_IMAGE_NAME=react.sdk:%PROJECT_NAME% >> !DC_ENV!
            echo SVC_CONTAINER_NAME=%DOCKER_CONTAINER_NAME%-%TARGET_PROJECT_MODEL_SERVER_HOSTNAME% >> !DC_ENV!
            echo SVC_PORT=%TARGET_PROJECT_MODEL_SERVER_PORT% >> !DC_ENV!
            echo SVC_COMMAND=%TARGET_PROJECT_COMMAND% >> !DC_ENV!

            @rem dummy server config
            echo DUMMY_IMAGE_NAME=react.sdk:%PROJECT_NAME% >> !DC_ENV!
            echo DUMMY_CONTAINER_NAME=%DOCKER_CONTAINER_NAME%-%TARGET_PROJECT_DUMMY_SERVER_HOSTNAME% >> !DC_ENV!
            echo DUMMY_PORT=%TARGET_PROJECT_DUMMY_SERVER_PORT% >> !DC_ENV!
            echo DUMMY_COMMAND=%TARGET_PROJECT_COMMAND% >> !DC_ENV!

            @rem startup with docker-compose
            if "%VAR_SRV_HOSTNAME%" == "all" (
                docker compose --file !DC_CONF! --env-file !DC_ENV! run -ti --rm web init
                docker compose --file !DC_CONF! --env-file !DC_ENV! up -d
            ) else (
                call :do-dev-remove %DOCKER_CONTAINER_NAME%-%VAR_SRV_HOSTNAME%
                docker compose --file !DC_CONF! --env-file !DC_ENV! run -ti --rm %VAR_SRV_HOSTNAME% init
                if not defined VAR_SRV_STATE (
                    docker compose --file !DC_CONF! --env-file !DC_ENV! run -ti --rm --service-ports %VAR_SRV_HOSTNAME%
                ) else (
                    docker compose --file !DC_CONF! --env-file !DC_ENV! run -d --service-ports %VAR_SRV_HOSTNAME%
                )
            )
        ) else (
            echo ^> !DC_CONF! can not find.
        )
    )
    goto end

:pre-do-pub
    call :do-dev-prepare

    if EXIST %CLI_DIRECTORY%\cache\publish (rd /S /Q %CLI_DIRECTORY%\cache\publish)
    mkdir %CLI_DIRECTORY%\cache\publish
    goto end

:do-pub
    @rem Declare variable
    set DOCKER_CONTAINER_NAME=%PROJECT_NAME%-builder

    @rem Startup service with parameter
    echo ^> Startup builder
    call :do-dev-remove builder

    echo ^> Start builder with docker-compose
    set DC_ENV=%CLI_DIRECTORY%\cache\docker-compose-pub.env
    set DC_CONF=%CLI_DIRECTORY%\conf\docker\docker-compose-pub.yml
    IF EXIST !DC_CONF! (
        @rem create docker-compose env file
        IF EXIST !DC_ENV! (del !DC_ENV!)
        echo PROJECT_NAME=%PROJECT_NAME% > !DC_ENV!
        echo PROJECT_DIR=%CLI_DIRECTORY% >> !DC_ENV!
        echo SRV_HOSTNAME=%VAR_SRV_HOSTNAME% >> !DC_ENV!
        echo SRV_IMAGE_NAME=react.sdk:%PROJECT_NAME% >> !DC_ENV!
        echo SRV_CONTAINER_NAME=%DOCKER_CONTAINER_NAME% >> !DC_ENV!
        echo SRV_COMMAND=build >> !DC_ENV!

        @rem publish with docker-compose
        docker compose --file !DC_CONF! --env-file !DC_ENV! run --remove-orphans builder
    ) else (
        echo ^> !DC_CONF! can not find.
    )
    goto end

:post-do-pub
    @rem execute integrate pacakge script
    IF EXIST %CLI_DIRECTORY%\conf\publish\main.sh (
        @rem build runner and config file
        docker run -ti --rm ^
          -v %CLI_DIRECTORY%:/app ^
          -w "/app" ^
          --entrypoint sh ^
          alpine/git -c "./conf/publish/main.sh %PROJECT_NAME%"
    )
    goto end

@rem ------------------- End method-------------------

:end
