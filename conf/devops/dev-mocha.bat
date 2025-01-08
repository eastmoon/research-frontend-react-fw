@rem ------------------- batch setting -------------------
@echo off

@rem ------------------- declare variable -------------------

@rem ------------------- execute script -------------------
call :%*
goto end

@rem ------------------- declare function -------------------

:action
    @rem execute script
    call %CLI_SHELL_DIRECTORY%\utils\tools.bat workflow do-dev ^
        %TARGET_PROJECT_MOCHA_SERVER_HOSTNAME% ^
        %TARGET_PROJECT_DEV_SERVER_IN_BACKGROUND%
    goto end

:args
    set COMMON_ARGS_KEY=%1
    set COMMON_ARGS_VALUE=%2
    if "%COMMON_ARGS_KEY%"=="--stop" (set TARGET_PROJECT_STOP=true)
    if "%COMMON_ARGS_KEY%"=="--into" (set TARGET_PROJECT_COMMAND=bash)
    if "%COMMON_ARGS_KEY%"=="--detach" (set TARGET_PROJECT_DEV_SERVER_IN_BACKGROUND=--detach)
    goto end

:short
    echo Startup mocha to do model develop.
    goto end

:help
    echo This is a Command Line Interface with project %PROJECT_NAME%
    echo Startup mocha to do model develop.
    echo.
    echo Options:
    echo      --help, -h        Show more command information.
    echo      --stop            Stop container if server was on work.
    echo      --into            Startup container and into it, but it will not start server.
    echo      --detach          Run container in background.
    call %CLI_SHELL_DIRECTORY%\utils\tools.bat command-description %~n0
    goto end

:end
