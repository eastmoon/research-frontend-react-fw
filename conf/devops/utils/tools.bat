@rem ------------------- batch setting -------------------
@echo off

@rem ------------------- execute script -------------------
call :%*
goto end

@rem ------------------- declare function -------------------

:command-description
    set TARGET_FILE_PATTERN="^[a-z]*\.bat"
    set COMMAND_DESC_P1=%1
    if defined COMMAND_DESC_P1 ( set TARGET_FILE_PATTERN="^%COMMAND_DESC_P1%-[a-z]*\.bat" )
    dir %CLI_SHELL_DIRECTORY% /b | findstr %TARGET_FILE_PATTERN% >nul 2>&1
    if errorlevel 1 (
        echo.
    ) else (
        echo.
        echo Command:
        for /f "tokens=*" %%p in ('dir %CLI_SHELL_DIRECTORY% /b ^| findstr %TARGET_FILE_PATTERN%') do (
            set COMMAND_DESC_NAME=%%~np
            set CDNT=!COMMAND_DESC_NAME:-= !
            for %%a in (!CDNT!) do ( set COMMAND_DESC_NAME=%%a )
            for /f "tokens=*" %%f in ('%CLI_SHELL_DIRECTORY%\%%p short') DO ( SET COMMAND_DESCSHORT=%%f )
            echo      !COMMAND_DESC_NAME!           !COMMAND_DESCSHORT!
        )
        echo.
        echo Run '%CLI_FILENAME% [COMMAND] --help' for more information on a command.
    )
    goto end

:workflow
    set TARGET_LIBRARIES_FILE=%CLI_SHELL_DIRECTORY%\utils\workflows.bat
    set TARGET_FUNC=%1
    set TARGET_ARGV=
    for /f "tokens=1*" %%p in ("%*") do (set TARGET_ARGV=%%q)
    if exist %TARGET_LIBRARIES_FILE% (
        set is_call=
        for /f "tokens=1" %%p in ('findstr /bi /c:":%TARGET_FUNC%" %TARGET_LIBRARIES_FILE%') do (
            set is_call=ture
        )
        if defined is_call (
            for /f "tokens=1" %%p in ('findstr /bi /c:":pre-%TARGET_FUNC%" %TARGET_LIBRARIES_FILE%') do (call %TARGET_LIBRARIES_FILE% pre-%TARGET_FUNC% %TARGET_ARGV%)
            call %TARGET_LIBRARIES_FILE% %TARGET_FUNC% %TARGET_ARGV%
            for /f "tokens=1" %%p in ('findstr /bi /c:":post-%TARGET_FUNC%" %TARGET_LIBRARIES_FILE%') do (call %TARGET_LIBRARIES_FILE% post-%TARGET_FUNC% %TARGET_ARGV%)
        ) else (
            echo function '%TARGET_FUNC%' can't find in %TARGET_LIBRARIES_FILE%
        )
    ) else (
        echo %TARGET_LIBRARIES_FILE% can't find.
    )
    goto end
@rem ------------------- End method-------------------

:end
