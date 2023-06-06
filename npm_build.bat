@echo off 
cls
title "build langium project"
echo %DATE%, %TIME%

if exist node_modules\ (
    echo "npm modules are up to date"
) else (
    npm update
)
if (%ERRORLEVEL%)==(0) ( del /f /q "npm_config_list.txt" && call npm config list --json >> "npm_config_list.txt" )
if (%ERRORLEVEL%)==(0) ( del /f /q "npm_packages.txt" && call npm ls >> "npm_packages.txt" )
if (%ERRORLEVEL%)==(0) ( call npm run langium:generate )
if (%ERRORLEVEL%)==(0) ( call npm run build )

if (%ERRORLEVEL%) NEQ (0) (
    echo "Build failed"
) else (
    echo "Build success"
)

if (%ERRORLEVEL%)==(0) ( call vsce package )
if (%ERRORLEVEL%)==(0) (
    echo "vscode extension created successfully"
)

::EXIT /B %ERRORLEVEL%
EXIT
