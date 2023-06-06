@echo off 

:: get current folder name
for %%I in (.) do set CurrDirName=%%~nxI

:: get timestamp
FOR /f "usebackq" %%i IN (`PowerShell ^(Get-Date^).ToString^('yyyyMMdd_HHmm'^)`) DO SET timestamp=%%i

IF EXIST 7z (
    echo "Found 7Z"
    7z a %CurrDirName%.zip .\ -r -xr!".git" -xr!".zip"
) else (
    IF EXIST "c:\Program Files\7-Zip\7z.exe" (
        echo "Found 7Z from c:\Program Files\7-Zip\7z"
        "c:\Program Files\7-Zip\7z" a %CurrDirName%_d%timestamp%.zip .\ -r -xr!".git" -xr!*.zip
    ) 
)
