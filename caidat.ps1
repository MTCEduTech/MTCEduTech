# Tạo shortcut index.html với icon tùy chỉnh

$WScriptShell = New-Object -ComObject WScript.Shell

# Lấy đường dẫn Desktop và thư mục chứa file script/exe
$desktop = [Environment]::GetFolderPath("Desktop")
$source = Split-Path -Parent $MyInvocation.MyCommand.Definition
$shortcutPath = Join-Path $desktop "Bo cong cu GD.lnk"
$targetPath = Join-Path $source "index.html"
$iconPath = Join-Path $source "icon.ico"

# Kiểm tra index.html tồn tại
if (-Not (Test-Path $targetPath)) {
    Write-Host "❌ Loi: KHONG tim thay $targetPath"
    pause
    exit
}

# Kiểm tra icon.ico tồn tại
if (-Not (Test-Path $iconPath)) {
    Write-Host "⚠️ Canh bao: KHONG tim thay icon.ico. Se dung icon mac dinh."
    $iconPath = $null
}

# Tạo shortcut
$shortcut = $WScriptShell.CreateShortcut($shortcutPath)
$shortcut.TargetPath = $targetPath
$shortcut.WorkingDirectory = $source

if ($iconPath) {
    $shortcut.IconLocation = $iconPath
}

$shortcut.Save()

Write-Host "✅ Shortcut da duoc tao tai: $shortcutPath"
pause