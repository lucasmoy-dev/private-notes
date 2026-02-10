param (
    [string]$Choice
)

function Show-Menu {
    Write-Host "===================================" -ForegroundColor Cyan
    Write-Host "   Private Notes Release Manager   " -ForegroundColor Cyan
    Write-Host "===================================" -ForegroundColor Cyan
    Write-Host "1. WebApp Release"
    Write-Host "2. Android Release"
    Write-Host "3. Exit"
    Write-Host "===================================" -ForegroundColor Cyan
}

if ([string]::IsNullOrEmpty($Choice)) {
    Show-Menu
    $Choice = Read-Host "Select an option (1-3)"
}

# Load update-version utility
$updateScriptPath = Join-Path (Get-Location) "sources\scripts\update-version.ps1"
$pushScriptPath = Join-Path (Get-Location) "sources\scripts\build-and-push.ps1"
$webappPath = Join-Path (Get-Location) "sources\webapp"

switch ($Choice) {
    "1" {
        Write-Host "Starting WebApp Release..." -ForegroundColor Yellow
        
        # 1. Update Version
        # Run in a separate scope to get the return value cleanly
        $newVersion = & $updateScriptPath
        
        if (-not $newVersion) {
            Write-Host "❌ Failed to update version" -ForegroundColor Red
            exit 1
        }
        Write-Host "New version: $newVersion" -ForegroundColor Green

        # 2. Build WebApp
        Write-Host "Building WebApp..." -ForegroundColor Yellow
        Push-Location $webappPath
        npm run build
        Pop-Location

        # 3. Copy to releases/webapp
        $releaseDir = Join-Path (Get-Location) "releases\webapp"
        if (!(Test-Path $releaseDir)) { New-Item -ItemType Directory -Path $releaseDir -Force | Out-Null }
        
        Write-Host "Copying to releases/webapp..." -ForegroundColor Yellow
        Remove-Item "$releaseDir\*" -Recurse -Force -ErrorAction SilentlyContinue
        Copy-Item "$webappPath\dist\*" $releaseDir -Recurse -Force

        # 4. Commit and Push
        Write-Host "Pushing to Git..." -ForegroundColor Yellow
        & $pushScriptPath -Message "Web Release v$newVersion"

        Write-Host "✅ WebApp Release Completed!" -ForegroundColor Green
    }
    "2" {
        Write-Host "Starting Android Release..." -ForegroundColor Yellow
        
        # 1. Update Version
        $newVersion = & $updateScriptPath

        if (-not $newVersion) {
            Write-Host "❌ Failed to update version" -ForegroundColor Red
            exit 1
        }
        Write-Host "New version: $newVersion" -ForegroundColor Green

        # 2. Build Android
        $androidReleaseScript = Join-Path (Get-Location) "sources\scripts\android-release.ps1"
        & $androidReleaseScript -Version $newVersion
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Android build failed" -ForegroundColor Red
            exit 1
        }

        # 3. Commit and Push
        Write-Host "Pushing to Git..." -ForegroundColor Yellow
        & $pushScriptPath -Message "Android Release v$newVersion"

        Write-Host "✅ Android Release Completed!" -ForegroundColor Green
    }
    "3" {
        Write-Host "Exiting..." -ForegroundColor Gray
        exit 0
    }
    Default {
        Write-Host "Invalid option." -ForegroundColor Red
    }
}
