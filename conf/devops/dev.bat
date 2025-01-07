@rem ------------------- batch setting -------------------
@echo off

@rem ------------------- declare variable -------------------

@rem ------------------- execute script -------------------
call :%*
goto end

@rem ------------------- declare function -------------------

:action
    @rem execute script
    set TARGET_PROJECT_DEV_SERVER_IN_BACKGROUND=--detach
    call %CLI_SHELL_DIRECTORY%\utils\tools.bat workflow do-dev ^
        all ^
        %TARGET_PROJECT_DEV_SERVER_IN_BACKGROUND%
    goto end

:args
    set COMMON_ARGS_KEY=%1
    set COMMON_ARGS_VALUE=%2
    if "%COMMON_ARGS_KEY%"=="--stop" (set TARGET_PROJECT_STOP=true)
    goto end

:short
    echo Developer mode
    goto end

:help
    echo This is a Command Line Interface with project %PROJECT_NAME%
    echo Startup developer environment
    echo.
    echo Options:
    echo      --help, -h        Show more command information.
    echo      --stop            Stop all container in developer environment.
    call %CLI_SHELL_DIRECTORY%\utils\tools.bat command-description %~n0
    goto end

:end
