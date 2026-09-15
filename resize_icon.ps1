[Reflection.Assembly]::LoadWithPartialName("System.Drawing") | Out-Null

$iconPath = "android/app/src/main/assets/Icon.png"
$sizes = @(
    @{density="mdpi"; size=48; folder="mipmap-mdpi"},
    @{density="hdpi"; size=72; folder="mipmap-hdpi"},
    @{density="xhdpi"; size=96; folder="mipmap-xhdpi"},
    @{density="xxhdpi"; size=144; folder="mipmap-xxhdpi"},
    @{density="xxxhdpi"; size=192; folder="mipmap-xxxhdpi"}
)

$original = [System.Drawing.Image]::FromFile((Resolve-Path $iconPath))
Write-Host "Loaded icon: $($original.Width)x$($original.Height)px"

foreach ($s in $sizes) {
    $resized = New-Object System.Drawing.Bitmap($s.size, $s.size)
    $graphics = [System.Drawing.Graphics]::FromImage($resized)
    $graphics.DrawImage($original, 0, 0, $s.size, $s.size)
    $graphics.Dispose()

    $outputDir = "android/app/src/main/res/$($s.folder)"

    # Save regular icon
    $resized.Save("$outputDir/ic_launcher.png")
    Write-Host "[OK] $($s.density) ($($s.size)x$($s.size)) - $outputDir/ic_launcher.png"

    # Save rounded version (same for now)
    $resized.Save("$outputDir/ic_launcher_round.png")

    $resized.Dispose()
}

$original.Dispose()
Write-Host "Done! All icons resized."
