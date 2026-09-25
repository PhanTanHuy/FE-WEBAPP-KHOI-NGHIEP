$bytes = [System.IO.File]::ReadAllBytes((Join-Path $PSScriptRoot 'build_role_design.ps1'))
$text = [System.Text.Encoding]::UTF8.GetString($bytes)
$block = [ScriptBlock]::Create($text)
& $block
