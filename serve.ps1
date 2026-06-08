$root = "C:\belavenda"
$port = 5500
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "BelaVenda rodando em http://localhost:$port/index.html"
$mimes = @{'.html'='text/html; charset=utf-8';'.css'='text/css';'.js'='application/javascript';'.png'='image/png';'.jpg'='image/jpeg';'.ico'='image/x-icon';'.svg'='image/svg+xml'}
while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $path = $ctx.Request.Url.LocalPath
    if ($path -eq '/') { $path = '/index.html' }
    $file = Join-Path $root $path.TrimStart('/')
    $res = $ctx.Response
    if (Test-Path $file -PathType Leaf) {
        $ext = [System.IO.Path]::GetExtension($file).ToLower()
        $res.ContentType = if ($mimes[$ext]) { $mimes[$ext] } else { 'application/octet-stream' }
        $bytes = [System.IO.File]::ReadAllBytes($file)
        $res.ContentLength64 = $bytes.Length
        $res.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $res.StatusCode = 404
        $msg = [System.Text.Encoding]::UTF8.GetBytes('Not found')
        $res.OutputStream.Write($msg, 0, $msg.Length)
    }
    $res.OutputStream.Close()
}
