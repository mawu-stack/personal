$ErrorActionPreference = 'Stop'
$projectRoot = $PSScriptRoot
$pythonExe = Join-Path $projectRoot '.venv\Scripts\python.exe'
$backendDir = Join-Path $projectRoot 'backend'
$webDir = Join-Path $projectRoot 'flutter_app\build\web'
if (!(Test-Path -LiteralPath $pythonExe) -or !(Test-Path -LiteralPath (Join-Path $webDir 'index.html'))) {
    throw 'The Python environment or Flutter web build is missing. Follow README.md to install/build first.'
}
try { $null = Invoke-RestMethod 'http://127.0.0.1:8000/health' -TimeoutSec 2 } catch {
    Start-Process -FilePath $pythonExe -ArgumentList '-m uvicorn app.main:app --host 127.0.0.1 --port 8000' -WorkingDirectory $backendDir -WindowStyle Hidden -RedirectStandardOutput (Join-Path $projectRoot 'backend-server.log') -RedirectStandardError (Join-Path $projectRoot 'backend-errors.log') | Out-Null
}
try { $null = Invoke-WebRequest 'http://127.0.0.1:8080/' -TimeoutSec 2 } catch {
    Start-Process -FilePath $pythonExe -ArgumentList '-m http.server 8080 --bind 127.0.0.1' -WorkingDirectory $webDir -WindowStyle Hidden -RedirectStandardOutput (Join-Path $projectRoot 'web-server.log') -RedirectStandardError (Join-Path $projectRoot 'web-errors.log') | Out-Null
}
Write-Host 'PhishGuard: http://127.0.0.1:8080/   API: http://127.0.0.1:8000/docs'
Write-Host 'If a different app already occupies either port, close it before running this launcher.'
Start-Process 'http://127.0.0.1:8080/'
