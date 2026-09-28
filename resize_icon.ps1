Add-Type -AssemblyName System.Drawing

$iconPath = "android/app/src/main/assets/Icon.png"
$sizes = @(
    @{density="mdpi"; size=48; adaptiveSize=108; folder="mipmap-mdpi"},
    @{density="hdpi"; size=72; adaptiveSize=162; folder="mipmap-hdpi"},
    @{density="xhdpi"; size=96; adaptiveSize=216; folder="mipmap-xhdpi"},
    @{density="xxhdpi"; size=144; adaptiveSize=324; folder="mipmap-xxhdpi"},
    @{density="xxxhdpi"; size=192; adaptiveSize=432; folder="mipmap-xxxhdpi"}
)

$original = [System.Drawing.Image]::FromFile((Resolve-Path $iconPath))
Write-Host "Loaded icon: $($original.Width)x$($original.Height)px"

foreach ($s in $sizes) {
    $resized = New-Object System.Drawing.Bitmap($s.size, $s.size)
    $graphics = [System.Drawing.Graphics]::FromImage($resized)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.DrawImage($original, 0, 0, $s.size, $s.size)
    $graphics.Dispose()

    $outputDir = "android/app/src/main/res/$($s.folder)"

    # Save regular icon
    $resized.Save("$outputDir/ic_launcher.png")
    Write-Host "[OK] $($s.density) ($($s.size)x$($s.size)) - $outputDir/ic_launcher.png"

    # Save rounded version (same for now)
    $resized.Save("$outputDir/ic_launcher_round.png")

    $resized.Dispose()

    # Adaptive icons use a 108dp canvas. Keep the artwork in the 66dp safe zone
    # so launchers can apply circle, squircle, and other masks without clipping it.
    $foreground = New-Object System.Drawing.Bitmap($s.adaptiveSize, $s.adaptiveSize)
    $foreground.SetResolution($original.HorizontalResolution, $original.VerticalResolution)
    $graphics = [System.Drawing.Graphics]::FromImage($foreground)
    $graphics.Clear([System.Drawing.Color]::Transparent)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $artSize = [int][Math]::Round($s.adaptiveSize * 0.68)
    $offset = [int](($s.adaptiveSize - $artSize) / 2)
    $graphics.DrawImage($original, $offset, $offset, $artSize, $artSize)
    $graphics.Dispose()
    $foreground.Save("$outputDir/ic_launcher_foreground.png", [System.Drawing.Imaging.ImageFormat]::Png)
    $foreground.Dispose()
}

$original.Dispose()
Write-Host "Done! All icons resized."
