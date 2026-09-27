param(
    [string]$OutputPath = (Join-Path $PSScriptRoot 'docs\EDUCONNECT_HUONG_DAN_TEST_MANUAL.docx')
)

$ErrorActionPreference = 'Stop'

function Get-WordColor([int]$r, [int]$g, [int]$b) {
    return $r + (256 * $g) + (65536 * $b)
}

$wdStyleNormal = -1
$wdStyleHeading1 = -2
$wdStyleHeading2 = -3
$wdStyleHeading3 = -4
$wdStyleTitle = -63
$wdStyleSubtitle = -75
$wdAlignLeft = 0
$wdAlignCenter = 1
$wdAlignRight = 2
$wdCollapseEnd = 0
$wdPageBreak = 7
$wdFieldPage = 33
$wdBorderTop = -1
$wdBorderLeft = -2
$wdBorderBottom = -3
$wdBorderRight = -4
$wdBorderHorizontal = -5
$wdBorderVertical = -6
$wdLineStyleSingle = 1
$wdCellAlignVerticalCenter = 1
$wdPreferredWidthPoints = 3

$black = Get-WordColor 0 0 0
$darkBlue = Get-WordColor 30 58 138
$paleBlue = Get-WordColor 239 246 255
$lightGray = Get-WordColor 217 217 217
$softGray = Get-WordColor 100 116 139
$veryLightGray = Get-WordColor 248 250 252
$white = Get-WordColor 255 255 255

$outputDir = Split-Path -Parent $OutputPath
if (-not (Test-Path -LiteralPath $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
}

$word = $null
$doc = $null
try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    $word.DisplayAlerts = 0
    $doc = $word.Documents.Add()
    $sel = $word.Selection

    $section = $doc.Sections.Item(1)
    $section.PageSetup.PaperSize = 7
    $section.PageSetup.TopMargin = $word.CentimetersToPoints(1.8)
    $section.PageSetup.BottomMargin = $word.CentimetersToPoints(1.7)
    $section.PageSetup.LeftMargin = $word.CentimetersToPoints(2.0)
    $section.PageSetup.RightMargin = $word.CentimetersToPoints(2.0)
    $section.PageSetup.HeaderDistance = $word.CentimetersToPoints(0.8)
    $section.PageSetup.FooterDistance = $word.CentimetersToPoints(0.8)

    $normal = $doc.Styles.Item($wdStyleNormal)
    $normal.Font.Name = 'Aptos'
    $normal.Font.Size = 10.5
    $normal.Font.Color = $black
    $normal.ParagraphFormat.SpaceAfter = 6
    $normal.ParagraphFormat.LineSpacingRule = 0

    foreach ($styleId in @($wdStyleTitle, $wdStyleSubtitle, $wdStyleHeading1, $wdStyleHeading2, $wdStyleHeading3)) {
        $style = $doc.Styles.Item($styleId)
        $style.Font.Name = 'Aptos Display'
        $style.Font.Color = $black
        $style.Font.Underline = 0
    }
    $doc.Styles.Item($wdStyleTitle).Font.Size = 28
    $doc.Styles.Item($wdStyleTitle).Font.Bold = $true
    $doc.Styles.Item($wdStyleSubtitle).Font.Size = 13
    $doc.Styles.Item($wdStyleSubtitle).Font.Color = $softGray
    $doc.Styles.Item($wdStyleHeading1).Font.Size = 17
    $doc.Styles.Item($wdStyleHeading1).Font.Bold = $true
    $doc.Styles.Item($wdStyleHeading1).ParagraphFormat.SpaceBefore = 14
    $doc.Styles.Item($wdStyleHeading1).ParagraphFormat.SpaceAfter = 7
    $doc.Styles.Item($wdStyleHeading1).ParagraphFormat.KeepWithNext = $true
    $doc.Styles.Item($wdStyleHeading2).Font.Size = 13
    $doc.Styles.Item($wdStyleHeading2).Font.Bold = $true
    $doc.Styles.Item($wdStyleHeading2).ParagraphFormat.SpaceBefore = 10
    $doc.Styles.Item($wdStyleHeading2).ParagraphFormat.SpaceAfter = 5
    $doc.Styles.Item($wdStyleHeading2).ParagraphFormat.KeepWithNext = $true
    $doc.Styles.Item($wdStyleHeading3).Font.Size = 11
    $doc.Styles.Item($wdStyleHeading3).Font.Bold = $true
    $doc.Styles.Item($wdStyleHeading3).ParagraphFormat.KeepWithNext = $true

    function Set-EndSelection {
        $sel.SetRange($doc.Content.End - 1, $doc.Content.End - 1)
    }

    function Add-Paragraph {
        param(
            [string]$Text = '',
            [int]$Style = $wdStyleNormal,
            [int]$Align = $wdAlignLeft,
            [bool]$Bold = $false,
            [double]$Size = 0,
            [int]$SpaceAfter = 6,
            [int]$SpaceBefore = 0
        )
        Set-EndSelection
        $sel.Style = $Style
        $sel.ParagraphFormat.Alignment = $Align
        $sel.ParagraphFormat.SpaceAfter = $SpaceAfter
        $sel.ParagraphFormat.SpaceBefore = $SpaceBefore
        $sel.Font.Bold = $Bold
        if ($Size -gt 0) { $sel.Font.Size = $Size }
        $sel.TypeText($Text)
        $sel.TypeParagraph()
        $sel.Font.Bold = $false
        if ($Size -gt 0) { $sel.Font.Size = 10.5 }
    }

    function Add-Bullet {
        param([string]$Text)
        Set-EndSelection
        $sel.Style = $wdStyleNormal
        $sel.ParagraphFormat.LeftIndent = $word.CentimetersToPoints(0.55)
        $sel.ParagraphFormat.FirstLineIndent = $word.CentimetersToPoints(-0.35)
        $sel.ParagraphFormat.SpaceAfter = 4
        $sel.TypeText("- $Text")
        $sel.TypeParagraph()
        $sel.ParagraphFormat.LeftIndent = 0
        $sel.ParagraphFormat.FirstLineIndent = 0
    }

    function Add-PageBreak {
        Set-EndSelection
        $sel.InsertBreak($wdPageBreak)
    }

    function Format-Table {
        param($Table, [double[]]$Widths)
        $Table.AllowAutoFit = $false
        $Table.Rows.Alignment = 0
        $Table.Rows.SetLeftIndent(0, 0)
        $Table.Range.Font.Name = 'Aptos'
        $Table.Range.Font.Size = 9.3
        $Table.Range.ParagraphFormat.SpaceAfter = 2
        $Table.Range.ParagraphFormat.SpaceBefore = 2
        for ($c = 1; $c -le $Widths.Count; $c++) {
            $Table.Columns.Item($c).PreferredWidthType = $wdPreferredWidthPoints
            $Table.Columns.Item($c).PreferredWidth = $word.CentimetersToPoints($Widths[$c - 1])
        }
        foreach ($row in $Table.Rows) {
            $row.AllowBreakAcrossPages = $true
            foreach ($cell in $row.Cells) {
                $cell.VerticalAlignment = $wdCellAlignVerticalCenter
                $cell.TopPadding = $word.CentimetersToPoints(0.12)
                $cell.BottomPadding = $word.CentimetersToPoints(0.12)
                $cell.LeftPadding = $word.CentimetersToPoints(0.12)
                $cell.RightPadding = $word.CentimetersToPoints(0.12)
            }
        }
        foreach ($borderId in @($wdBorderTop, $wdBorderLeft, $wdBorderBottom, $wdBorderRight, $wdBorderHorizontal, $wdBorderVertical)) {
            $border = $Table.Borders.Item($borderId)
            $border.LineStyle = $wdLineStyleSingle
            $border.Color = $lightGray
            $border.LineWidth = 4
        }
    }

    function Add-InfoTable {
        param(
            [string[]]$Headers,
            [object[]]$Rows,
            [double[]]$Widths
        )
        Set-EndSelection
        $table = $doc.Tables.Add($sel.Range, $Rows.Count + 1, $Headers.Count)
        Format-Table -Table $table -Widths $Widths
        $table.Rows.Item(1).HeadingFormat = $true
        for ($c = 1; $c -le $Headers.Count; $c++) {
            $cell = $table.Cell(1, $c)
            $cell.Range.Text = $Headers[$c - 1]
            $cell.Range.Font.Bold = $true
            $cell.Range.Font.Color = $white
            $cell.Shading.BackgroundPatternColor = $darkBlue
            $cell.Range.ParagraphFormat.Alignment = $wdAlignCenter
        }
        for ($r = 0; $r -lt $Rows.Count; $r++) {
            $rowData = $Rows[$r]
            for ($c = 0; $c -lt $Headers.Count; $c++) {
                $cell = $table.Cell($r + 2, $c + 1)
                $cell.Range.Text = [string]$rowData[$c]
                if ($c -eq 0 -or $c -eq ($Headers.Count - 1)) {
                    $cell.Range.ParagraphFormat.Alignment = $wdAlignCenter
                }
                if (($r % 2) -eq 1) {
                    $cell.Shading.BackgroundPatternColor = $veryLightGray
                }
            }
        }
        $after = $table.Range
        $after.Collapse($wdCollapseEnd)
        $after.InsertParagraphAfter()
        Set-EndSelection
        $sel.TypeParagraph()
        return $table
    }

    function Add-TestCase {
        param(
            [string]$Id,
            [string]$Title,
            [string]$Precondition,
            [object[]]$Steps,
            [string]$Note = ''
        )
        $caseCounter = (Get-Variable -Name manualCaseCounter -Scope 1).Value
        if ($caseCounter -gt 0) {
            Add-PageBreak
        }
        Set-Variable -Name manualCaseCounter -Scope 1 -Value ($caseCounter + 1)
        Add-Paragraph -Text "$Id  $Title" -Style $wdStyleHeading2
        Add-Paragraph -Text "Điều kiện: $Precondition" -Bold $true -SpaceAfter 5
        Add-InfoTable -Headers @('Bước', 'Người test thực hiện', 'Kết quả mong đợi', 'KQ') -Rows $Steps -Widths @(1.2, 6.2, 7.5, 1.1) | Out-Null
        if ($Note) {
            Add-Paragraph -Text "Lưu ý: $Note" -SpaceAfter 8
        }
    }

    # Cover
    Add-Paragraph -Text '' -SpaceAfter 28
    Add-Paragraph -Text 'EduConnect' -Align $wdAlignCenter -Bold $true -Size 14 -SpaceAfter 14
    Add-Paragraph -Text 'Hướng dẫn sử dụng và kiểm thử thủ công EduConnect' -Style $wdStyleTitle -Align $wdAlignCenter -SpaceAfter 14
    Add-Paragraph -Text 'Dành cho người kiểm thử không chuyên' -Style $wdStyleSubtitle -Align $wdAlignCenter -SpaceAfter 26
    Add-Paragraph -Text 'Tài liệu này hướng dẫn người dùng đi qua các chức năng chính của EduConnect bằng thao tác thực tế trên màn hình. Mỗi kịch bản cho biết cần bấm ở đâu, nhập dữ liệu gì và kết quả nào phải xuất hiện.' -Align $wdAlignCenter -Size 11.5 -SpaceAfter 18
    Add-Paragraph -Text 'Phiên bản kiểm thử  25 tháng 9 năm 2026' -Align $wdAlignCenter -Bold $true -Size 10.5 -SpaceAfter 8
    Add-Paragraph -Text 'Phạm vi  Website React và các API đang được kết nối trong project hiện tại' -Align $wdAlignCenter -Size 10 -SpaceAfter 0
    Add-PageBreak

    Add-Paragraph -Text 'Mục lục' -Style $wdStyleHeading1
    Set-EndSelection
    $toc = $doc.TablesOfContents.Add($sel.Range, $true, 1, 2)
    $toc.Range.Font.Name = 'Aptos'
    $toc.Range.Font.Size = 10
    Set-EndSelection
    $sel.TypeParagraph()
    Add-PageBreak

    Add-Paragraph -Text '1 Cách dùng tài liệu' -Style $wdStyleHeading1
    Add-Paragraph -Text 'Mục tiêu của bản này là để một người chưa biết lập trình vẫn có thể kiểm tra EduConnect theo đúng hành trình của phụ huynh, học sinh, gia sư và quản trị viên. Người test chỉ cần làm lần lượt từng bước, quan sát màn hình và đánh dấu kết quả.'
    Add-Bullet 'Đánh dấu PASS khi màn hình và dữ liệu đúng như cột Kết quả mong đợi.'
    Add-Bullet 'Đánh dấu FAIL khi không bấm được, sai dữ liệu, hiện lỗi, chuyển sai trang hoặc dữ liệu mất ngoài dự kiến.'
    Add-Bullet 'Đánh dấu BLOCKED khi môi trường, tài khoản hoặc dữ liệu chuẩn bị chưa đủ để tiếp tục.'
    Add-Bullet 'Không nhập thông tin cá nhân thật. Dùng dữ liệu thử được cung cấp trong tài liệu.'
    Add-Paragraph -Text 'Phân loại chức năng' -Style $wdStyleHeading2
    Add-InfoTable -Headers @('Nhãn', 'Ý nghĩa', 'Cách đánh giá') -Rows @(
        @('Chạy thật', 'Thao tác có gọi API và có thể ghi dữ liệu vào cơ sở dữ liệu.', 'Kiểm tra cả thông báo trên màn hình và dữ liệu sau khi tải lại trang.'),
        @('Phụ thuộc dữ liệu', 'Chức năng chạy thật nhưng cần tài khoản hoặc dữ liệu do nhóm dự án chuẩn bị.', 'Nếu thiếu dữ liệu, ghi BLOCKED thay vì FAIL.'),
        @('Mô phỏng', 'Giao diện phản hồi trong trình duyệt nhưng chưa lưu vào máy chủ.', 'Kiểm tra hiển thị; dữ liệu mất sau khi tải lại là hành vi hiện tại.'),
        @('Nút minh họa', 'Nút đang có trên giao diện nhưng chưa có xử lý hoàn chỉnh.', 'Không kỳ vọng phát sinh dữ liệu; ghi nhận nếu nút gây lỗi hoặc chuyển sai trang.')
    ) -Widths @(2.6, 7.2, 6.2) | Out-Null

    Add-Paragraph -Text '2 Chuẩn bị trước khi test' -Style $wdStyleHeading1
    Add-InfoTable -Headers @('Mục', 'Cần chuẩn bị', 'Gợi ý') -Rows @(
        @('Địa chỉ website', 'URL do nhóm dự án cung cấp.', 'Khi chạy local dùng http://localhost:5173'),
        @('Tài khoản phụ huynh', 'Có thể tự đăng ký tài khoản mới.', 'Dùng email duy nhất theo mẫu phuhuynh.test.<ngaygio>@example.com'),
        @('Tài khoản gia sư', 'Phải là tài khoản đã có hồ sơ gia sư được duyệt và liên kết đúng hồ sơ.', 'Nhóm phát triển cung cấp email và mật khẩu.'),
        @('Tài khoản quản trị', 'Role phải là admin.', 'Nhóm phát triển cung cấp email và mật khẩu.'),
        @('Dữ liệu nền', 'Có môn học, cấp học, địa điểm, gia sư và ít nhất một tài liệu đã duyệt.', 'Nếu danh sách trống toàn bộ, nhờ nhóm chạy migration và seed.'),
        @('Trình duyệt', 'Chrome hoặc Edge bản hiện hành.', 'Nên dùng cửa sổ ẩn danh cho lần test đầu.')
    ) -Widths @(3.0, 7.5, 5.5) | Out-Null
    Add-PageBreak
    Add-Paragraph -Text 'Dữ liệu mẫu an toàn' -Style $wdStyleHeading2
    Add-InfoTable -Headers @('Trường', 'Giá trị mẫu') -Rows @(
        @('Họ tên', 'Nguyễn Văn Test'),
        @('Điện thoại', '0901234567'),
        @('Mật khẩu', 'EduTest@123'),
        @('Ngày sinh', '15 05 2000'),
        @('Địa chỉ', '123 Đường Test, Quận 1, TP HCM'),
        @('Nội dung ghi chú', 'Cần ôn phần hàm số và luyện đề THPT'),
        @('Nhận xét', 'Gia sư giảng dễ hiểu và hỗ trợ đúng giờ')
    ) -Widths @(5.0, 11.0) | Out-Null

    Add-Paragraph -Text '3 Bản đồ hành trình chính' -Style $wdStyleHeading1
    Add-Paragraph -Text 'Hành trình phụ huynh và học sinh' -Style $wdStyleHeading2
    Add-Paragraph -Text 'Mở trang chủ  >  Đăng ký hoặc đăng nhập  >  Tìm gia sư  >  Xem hồ sơ  >  Đặt lịch  >  Quản lý lịch  >  Xem tiến độ  >  Đánh giá gia sư'
    Add-Paragraph -Text 'Hành trình ứng viên gia sư' -Style $wdStyleHeading2
    Add-Paragraph -Text 'Đăng nhập  >  Đăng ký làm gia sư  >  Lưu bản nháp  >  Gửi duyệt  >  Quản trị viên duyệt  >  Đăng nhập lại với role gia sư  >  Xác nhận và hoàn thành lịch học'
    Add-Paragraph -Text 'Hành trình tài liệu và quản trị' -Style $wdStyleHeading2
    Add-Paragraph -Text 'Tìm và xem tài liệu  >  Tải hoặc lưu yêu thích  >  Đóng góp tài liệu  >  Quản trị theo dõi dữ liệu và analytics'
    Add-Paragraph -Text 'Thứ tự test đề xuất' -Style $wdStyleHeading2
    Add-Bullet 'Vòng nhanh khoảng 30 phút: TC01, TC02, TC03, TC04, TC06 và TC14.'
    Add-Bullet 'Vòng đầy đủ khoảng 90 đến 120 phút: chạy toàn bộ TC01 đến TC15 theo thứ tự.'

    Add-PageBreak
    Add-Paragraph -Text '4 Kịch bản kiểm thử chi tiết' -Style $wdStyleHeading1

    $manualCaseCounter = 0

    Add-TestCase -Id 'TC01' -Title 'Mở trang chủ và điều hướng cơ bản' -Precondition 'Website và backend đã được khởi động.' -Steps @(
        @('1', 'Mở URL website.', 'Trang chủ EduConnect hiển thị logo, thanh menu, ô tìm kiếm, dịch vụ, gia sư nổi bật và chân trang.', '[ ]'),
        @('2', 'Cuộn từ đầu đến cuối trang.', 'Nội dung không chồng lên nhau; ảnh, thẻ và nút không bị cắt.', '[ ]'),
        @('3', 'Nhập Toán vào ô tìm kiếm lớn rồi bấm Tìm ngay.', 'Chuyển sang trang Tìm gia sư; URL có q=Toán và danh sách được lọc.', '[ ]'),
        @('4', 'Quay về trang chủ, lần lượt bấm Gia sư Online, Gia sư tại nhà, Học thử miễn phí.', 'Mỗi thẻ mở đúng trang dịch vụ tương ứng.', '[ ]'),
        @('5', 'Bấm logo EduConnect ở đầu trang từ một trang bất kỳ.', 'Quay về trang chủ.', '[ ]')
    )

    Add-TestCase -Id 'TC02' -Title 'Đăng ký đăng nhập và đăng xuất' -Precondition 'Chưa đăng nhập; có một email chưa từng dùng.' -Steps @(
        @('1', 'Mở Đăng ký và bấm Tạo tài khoản khi chưa nhập dữ liệu.', 'Hiện lỗi yêu cầu nhập họ và tên.', '[ ]'),
        @('2', 'Nhập họ tên, email duy nhất, số điện thoại; nhập mật khẩu ngắn hơn 6 ký tự.', 'Hiện lỗi mật khẩu phải có ít nhất 6 ký tự.', '[ ]'),
        @('3', 'Nhập mật khẩu EduTest@123 và xác nhận khác mật khẩu.', 'Hiện lỗi mật khẩu xác nhận không khớp.', '[ ]'),
        @('4', 'Sửa xác nhận cho đúng nhưng chưa chọn đồng ý điều khoản.', 'Hiện lỗi yêu cầu đồng ý điều khoản.', '[ ]'),
        @('5', 'Chọn đồng ý và bấm Tạo tài khoản.', 'Hiện thông báo đăng ký thành công, tự đăng nhập và về trang chủ; góc trên hiển thị tên người dùng.', '[ ]'),
        @('6', 'Bấm Đăng xuất, sau đó mở Đăng nhập và nhập sai mật khẩu.', 'Hiện thông báo đăng nhập thất bại; vẫn ở trang đăng nhập.', '[ ]'),
        @('7', 'Nhập đúng email và mật khẩu rồi bấm Đăng nhập.', 'Về trang trước hoặc trang chủ; tên người dùng xuất hiện trên thanh đầu trang.', '[ ]')
    ) -Note 'Ghi nhớ đăng nhập, Quên mật khẩu, Google và Facebook hiện chưa phải luồng xác thực hoàn chỉnh.'

    Add-TestCase -Id 'TC03' -Title 'Tìm kiếm lọc và sắp xếp gia sư' -Precondition 'Backend có dữ liệu gia sư đã duyệt.' -Steps @(
        @('1', 'Mở Tìm gia sư.', 'Hiện tổng số gia sư, bộ lọc và các thẻ gia sư.', '[ ]'),
        @('2', 'Nhập từ khóa Toán hoặc tên một gia sư.', 'Danh sách và số kết quả thay đổi; URL giữ từ khóa tìm kiếm.', '[ ]'),
        @('3', 'Chọn một Môn học, Cấp học và Hình thức dạy.', 'Chỉ còn các gia sư phù hợp; số bộ lọc đang chọn tăng.', '[ ]'),
        @('4', 'Bật Chỉ gia sư đã xác minh.', 'Các thẻ còn lại có dấu đã xác minh.', '[ ]'),
        @('5', 'Đổi Sắp xếp sang Giá tăng dần.', 'Học phí trên danh sách tăng dần từ trên xuống.', '[ ]'),
        @('6', 'Bấm Xóa tất cả.', 'Từ khóa và bộ lọc được xóa; danh sách quay về mặc định.', '[ ]'),
        @('7', 'Bấm một thẻ gia sư.', 'Mở đúng trang hồ sơ của gia sư đã chọn.', '[ ]')
    ) -Note 'Bộ lọc Khu vực phụ thuộc dữ liệu city trong cơ sở dữ liệu. Nếu chọn thành phố làm kết quả trống bất thường, chụp ảnh URL và ghi lỗi.'

    Add-TestCase -Id 'TC04' -Title 'Xem hồ sơ gia sư' -Precondition 'Đang ở hồ sơ một gia sư hợp lệ.' -Steps @(
        @('1', 'Kiểm tra ảnh, tên, danh hiệu, đánh giá, học phí và trạng thái xác minh.', 'Thông tin đầy đủ và không có giá trị null hoặc undefined.', '[ ]'),
        @('2', 'Mở lần lượt tab Thông tin, Lịch dạy và Đánh giá.', 'Nội dung đổi đúng theo tab; lịch theo các ngày trong tuần; đánh giá có sao và nhận xét.', '[ ]'),
        @('3', 'Bấm biểu tượng trái tim hai lần.', 'Trạng thái yêu thích bật rồi tắt trên giao diện.', '[ ]'),
        @('4', 'Bấm một gia sư trong phần Gia sư tương tự.', 'Mở đúng hồ sơ gia sư mới.', '[ ]'),
        @('5', 'Bấm Đặt lịch học ngay.', 'Chuyển đến trang Đặt lịch và giữ đúng tutorId trong URL.', '[ ]')
    ) -Note 'Chia sẻ và Nhắn tin gia sư hiện là nút minh họa; không kỳ vọng mở cuộc trò chuyện.'

    Add-TestCase -Id 'TC05' -Title 'Các trang gia sư online tại nhà và học thử' -Precondition 'Backend có dữ liệu gia sư.' -Steps @(
        @('1', 'Mở Dịch vụ rồi vào Gia sư online.', 'Trang chỉ hiển thị gia sư có hình thức online.', '[ ]'),
        @('2', 'Dùng ô tìm kiếm, chọn môn hoặc cấp học, thay đổi mức giá và sắp xếp.', 'Danh sách thay đổi theo lựa chọn; nút Xóa bộ lọc đưa về trạng thái ban đầu.', '[ ]'),
        @('3', 'Mở Gia sư tại nhà và lặp lại kiểm tra.', 'Trang chỉ hiển thị gia sư có hình thức tại nhà.', '[ ]'),
        @('4', 'Mở Học thử, nhập tên hoặc môn học trong ô tìm kiếm.', 'Danh sách học thử được lọc theo từ khóa.', '[ ]'),
        @('5', 'Bấm Xem hồ sơ trên một thẻ học thử.', 'Mở đúng hồ sơ gia sư.', '[ ]'),
        @('6', 'Bấm Đặt lịch học thử.', 'Ghi lại màn hình nhận được. Ở bản hiện tại thao tác này có thể mở trang Không tìm thấy gia sư do sai tên tham số URL.', '[ ]')
    ) -Note 'Các checkbox, lọc nhanh, sắp xếp, đổi kiểu hiển thị và phân trang trên trang Học thử phần lớn mới là giao diện minh họa.'

    Add-TestCase -Id 'TC06' -Title 'Đặt lịch học với gia sư' -Precondition 'Đã đăng nhập tài khoản phụ huynh và mở trang đặt lịch từ hồ sơ gia sư.' -Steps @(
        @('1', 'Ở bước 1 chọn Môn học, Cấp học, Hình thức, tăng Số buổi lên 2 và nhập ghi chú mẫu.', 'Nút Tiếp theo được bật sau khi chọn môn; tóm tắt học phí thay đổi theo số buổi.', '[ ]'),
        @('2', 'Sang bước 2, chọn một ngày trong tương lai và một khung giờ.', 'Khung giờ được tô trạng thái đã chọn; nút Tiếp theo được bật.', '[ ]'),
        @('3', 'Sang bước 3 và đối chiếu toàn bộ thông tin.', 'Tên gia sư, môn, cấp học, hình thức, ngày, giờ, số buổi và ghi chú đều đúng.', '[ ]'),
        @('4', 'Kiểm tra Tổng học phí ước tính.', 'Tổng bằng học phí mỗi giờ nhân 2 giờ nhân số buổi.', '[ ]'),
        @('5', 'Bấm Xác nhận đặt lịch.', 'Hiện Đặt lịch thành công và có nút Xem lịch học của tôi.', '[ ]'),
        @('6', 'Tải lại trang Quản lý đặt lịch.', 'Lịch vừa tạo vẫn còn và có trạng thái Chờ xác nhận.', '[ ]')
    ) -Note 'Nếu chưa đăng nhập, nút xác nhận phải yêu cầu đăng nhập và chuyển đến /dang-nhap.'

    Add-TestCase -Id 'TC07' -Title 'Quản lý vòng đời lịch học' -Precondition 'Có một lịch pending giữa tài khoản phụ huynh và tài khoản gia sư test tương ứng.' -Steps @(
        @('1', 'Đăng nhập phụ huynh, mở Quản lý đặt lịch.', 'Tab Lịch học của tôi hiển thị lịch pending và nút Hủy yêu cầu.', '[ ]'),
        @('2', 'Không hủy lịch này. Đăng xuất và đăng nhập tài khoản gia sư sở hữu hồ sơ đã được đặt.', 'Có tab Yêu cầu đặt lịch Gia sư và thấy đúng yêu cầu.', '[ ]'),
        @('3', 'Bấm Xác nhận.', 'Trạng thái chuyển thành Đã xác nhận sau khi tải lại.', '[ ]'),
        @('4', 'Bấm Đánh dấu Hoàn thành.', 'Trạng thái chuyển thành Đã hoàn thành.', '[ ]'),
        @('5', 'Đăng nhập lại phụ huynh.', 'Lịch hiển thị Đã hoàn thành và có nút Đánh giá gia sư.', '[ ]'),
        @('6', 'Tạo một lịch khác và bấm Hủy yêu cầu khi còn pending.', 'Trạng thái chuyển thành Đã hủy.', '[ ]')
    ) -Note 'Nếu chưa đăng nhập, nút Đăng nhập ngay trong trang này hiện dẫn tới /login thay vì /dang-nhap; xem danh sách vấn đề đã biết.'

    Add-TestCase -Id 'TC08' -Title 'Xem tiến độ học tập' -Precondition 'Đăng nhập phụ huynh; nên có booking confirmed hoặc completed.' -Steps @(
        @('1', 'Mở Tiến độ học tập trên menu.', 'Hiện lời chào đúng tên và các thẻ tổng số môn, giờ học, điểm trung bình, tỷ lệ bài tập.', '[ ]'),
        @('2', 'Đối chiếu danh sách môn học.', 'Mỗi môn có gia sư, tiến độ phần trăm, số buổi hoàn thành và điểm.', '[ ]'),
        @('3', 'Bấm Quản lý lịch học.', 'Chuyển sang trang Quản lý đặt lịch.', '[ ]'),
        @('4', 'Thử với tài khoản mới chưa có lịch.', 'Các chỉ số về 0 hoặc danh sách trống nhưng trang không vỡ giao diện.', '[ ]')
    ) -Note 'Khối nhận xét tổng quát và mục tiêu học tập hiện có nội dung mẫu cố định; không dùng chúng để đối chiếu dữ liệu thật.'

    Add-TestCase -Id 'TC09' -Title 'Đánh giá gia sư' -Precondition 'Đăng nhập phụ huynh và có lịch confirmed hoặc completed.' -Steps @(
        @('1', 'Từ Quản lý đặt lịch bấm Đánh giá gia sư.', 'Mở trang đánh giá với đúng gia sư và đúng booking.', '[ ]'),
        @('2', 'Chọn số sao, bấm một hoặc hai lời khen nhanh và nhập nhận xét.', 'Số sao và lời mô tả thay đổi; lời khen được đưa vào nhận xét.', '[ ]'),
        @('3', 'Bấm Gửi đánh giá ngay.', 'Hiện Đánh giá thành công.', '[ ]'),
        @('4', 'Mở lại đánh giá cho cùng booking.', 'Hiện thông báo đã đánh giá cùng số sao và nhận xét cũ; không cho gửi trùng.', '[ ]'),
        @('5', 'Mở hồ sơ gia sư và tab Đánh giá.', 'Đánh giá mới xuất hiện hoặc tổng điểm và số lượt đánh giá được cập nhật.', '[ ]')
    ) -Note 'Nếu chưa đăng nhập, nút Đăng nhập ngay trên trang đánh giá cũng đang dẫn tới /login.'

    Add-TestCase -Id 'TC10' -Title 'Đăng ký làm gia sư' -Precondition 'Có thể bắt đầu khi chưa đăng nhập, nhưng phải đăng nhập trước khi gửi duyệt.' -Steps @(
        @('1', 'Mở Đăng ký gia sư và bấm Tiếp theo khi để trống.', 'Lần lượt hiện yêu cầu họ tên, ngày sinh, số điện thoại và địa chỉ.', '[ ]'),
        @('2', 'Nhập thông tin cơ bản bằng dữ liệu mẫu; có thể chọn ảnh rõ mặt.', 'Ảnh xem trước hiện đúng; dữ liệu vẫn còn khi sang bước tiếp theo.', '[ ]'),
        @('3', 'Ở Trình độ học vấn chọn Đại học, nhập Sư phạm Toán; có thể tải bằng cấp PDF hoặc ảnh.', 'Tệp được báo tải thành công; có thể chọn chứng chỉ.', '[ ]'),
        @('4', 'Ở Cài đặt giảng dạy chọn Toán, THPT, Quận 1 và khoảng học phí.', 'Các lựa chọn được tô trạng thái và giá hiển thị đúng.', '[ ]'),
        @('5', 'Bấm Lưu bản nháp.', 'Nếu chưa đăng nhập, báo đã lưu tạm trong trình duyệt; nếu đã đăng nhập, báo lưu trên máy chủ.', '[ ]'),
        @('6', 'Sang bước Kiểm tra hồ sơ và đối chiếu dữ liệu.', 'Thông tin từ ba bước trước hiển thị đầy đủ và chính xác.', '[ ]'),
        @('7', 'Đăng nhập nếu cần rồi bấm Gửi hồ sơ xét duyệt.', 'Hiện trang Hoàn thành; trạng thái hồ sơ là pending hoặc Chờ duyệt.', '[ ]')
    )

    Add-TestCase -Id 'TC11' -Title 'Quản trị duyệt hoặc từ chối hồ sơ gia sư' -Precondition 'Đăng nhập tài khoản admin; có ít nhất hai hồ sơ pending để thử cả hai nhánh.' -Steps @(
        @('1', 'Mở trực tiếp /admin/duyet-gia-su.', 'Hiện số hồ sơ Chờ duyệt, Đã phê duyệt, Từ chối và Tổng số.', '[ ]'),
        @('2', 'Dùng các tab và ô tìm theo tên hoặc email.', 'Danh sách thay đổi đúng; số lượng trên tab khớp danh sách.', '[ ]'),
        @('3', 'Mở tệp chứng chỉ của một hồ sơ.', 'Tệp mở ở tab mới và đúng ứng viên.', '[ ]'),
        @('4', 'Bấm Phê duyệt hồ sơ và xác nhận hộp thoại.', 'Hồ sơ chuyển sang Đã duyệt; tài khoản ứng viên được đổi role thành tutor.', '[ ]'),
        @('5', 'Với hồ sơ khác bấm Từ chối, nhập lý do.', 'Hồ sơ chuyển sang Đã từ chối và hiển thị đúng lý do.', '[ ]'),
        @('6', 'Đăng nhập lại bằng tài khoản ứng viên đã duyệt.', 'Thanh đầu trang nhận role gia sư và có thể xem yêu cầu đặt lịch gia sư.', '[ ]')
    ) -Note 'Trang không tự chặn giao diện theo role; quyền thật được backend kiểm tra. Người không phải admin phải nhận lỗi 403 và không được duyệt dữ liệu.'

    Add-TestCase -Id 'TC12' -Title 'Tài liệu học tập' -Precondition 'Có ít nhất một tài liệu approved; đăng nhập để test yêu thích và đóng góp.' -Steps @(
        @('1', 'Mở Tài liệu học tập.', 'Hiện các tab loại tài liệu, bộ lọc khối lớp và môn học, cùng danh sách thẻ.', '[ ]'),
        @('2', 'Tìm một từ khóa rồi chọn môn hoặc khối lớp.', 'Danh sách thu hẹp; Xóa bộ lọc đưa về toàn bộ dữ liệu.', '[ ]'),
        @('3', 'Bấm Chi tiết trên một tài liệu.', 'Mở hộp thông tin gồm tiêu đề, người đăng, môn, khối, dung lượng, số trang và lượt tải.', '[ ]'),
        @('4', 'Bấm Lưu tài liệu.', 'Biểu tượng yêu thích đổi trạng thái và giữ đúng sau khi tải lại trang.', '[ ]'),
        @('5', 'Bấm Tải về.', 'Số lượt tải tăng và có thông báo bắt đầu tải. Kiểm tra thêm thư mục tải xuống nếu hệ thống trả file thật.', '[ ]'),
        @('6', 'Bấm Đóng góp tài liệu mới, nhập tiêu đề, mô tả, chọn loại và file rồi gửi.', 'Hiện thông báo thành công; tài liệu mới được tạo ở trạng thái chờ duyệt hoặc theo cấu hình backend.', '[ ]')
    ) -Note 'Nếu chưa đăng nhập, Lưu tài liệu và Đóng góp phải nhắc đăng nhập. Tải về hiện có thể chỉ báo thông báo mà chưa tự mở URL file.'

    Add-TestCase -Id 'TC13' -Title 'Dịch vụ đưa đón học sinh' -Precondition 'Không yêu cầu tài khoản trong giao diện hiện tại.' -Steps @(
        @('1', 'Mở Đưa đón học sinh.', 'Trang EduConnect Rides hiển thị chế độ người đặt xe.', '[ ]'),
        @('2', 'Nhập điểm đón và điểm đến rồi bấm Get Fare Estimate.', 'Hiện quãng đường, thời gian và giá ước tính.', '[ ]'),
        @('3', 'Bấm Confirm Booking.', 'Chuyến đi xuất hiện trong My Recent Rides với trạng thái pending.', '[ ]'),
        @('4', 'Tải lại trang.', 'Chuyến vừa tạo biến mất; đây là hành vi mô phỏng hiện tại.', '[ ]'),
        @('5', 'Bấm Switch to Driver.', 'Hiện Driver Dashboard và khu vực Available Requests.', '[ ]')
    ) -Note 'Trang này đang chạy hoàn toàn trong bộ nhớ trình duyệt, chưa gọi các API rides đã có ở backend.'

    Add-TestCase -Id 'TC14' -Title 'Trang quản trị tổng quan và analytics' -Precondition 'Có tài khoản admin và dữ liệu analytics phát sinh từ các bước tìm kiếm, xem gia sư, đặt lịch hoặc tải tài liệu.' -Steps @(
        @('1', 'Mở /admin.', 'Hiện bảng quản trị và chuyển được giữa User, Materials, Tutor Applications và Audit Logs.', '[ ]'),
        @('2', 'Bấm các nút Edit Role, Approve, Reject hoặc Review Docs.', 'Ghi nhận hành vi. Ở bản hiện tại đây là dữ liệu và nút minh họa, không lưu backend.', '[ ]'),
        @('3', 'Mở /admin/analytics.', 'Hiện KPI, hoạt động theo ngày, funnel, top gia sư, top tài liệu, môn học và từ khóa.', '[ ]'),
        @('4', 'Đổi khoảng 7, 14, 30 và 90 ngày; bấm Làm mới.', 'Dữ liệu tải lại theo khoảng thời gian và cập nhật thời điểm làm mới.', '[ ]')
    ) -Note 'Dashboard analytics hiện đọc khóa access_token trong khi đăng nhập lưu khóa token. Nếu trang không tải dữ liệu dù đã đăng nhập admin, xác nhận lỗi ở mục Vấn đề đã biết.'

    Add-TestCase -Id 'TC15' -Title 'Trang thông tin liên hệ giao diện di động và lỗi 404' -Precondition 'Website đang hoạt động.' -Steps @(
        @('1', 'Mở Giới thiệu, Dịch vụ và Liên hệ.', 'Mỗi trang có tiêu đề đúng, nội dung không vỡ và liên kết dịch vụ chuyển đúng trang.', '[ ]'),
        @('2', 'Ở Liên hệ nhập họ tên, email và nội dung rồi bấm Gửi tin nhắn.', 'Ghi nhận hành vi. Hiện form chưa có xử lý lưu hoặc gửi thông tin.', '[ ]'),
        @('3', 'Thu nhỏ trình duyệt như màn hình điện thoại và mở menu ba gạch.', 'Menu mở, nền phía sau khóa cuộn; chọn mục thì menu đóng.', '[ ]'),
        @('4', 'Mở một URL không tồn tại, ví dụ /khong-ton-tai.', 'Hiện trang 404 và nút quay về trang chủ hoạt động.', '[ ]'),
        @('5', 'Sau khi đăng nhập bấm avatar hoặc Hồ sơ cá nhân.', 'Ghi nhận màn hình. Bản hiện tại chưa có route /ho-so nên sẽ vào 404.', '[ ]')
    )

    Add-PageBreak
    Add-Paragraph -Text '5 Vấn đề đã biết trong phiên bản hiện tại' -Style $wdStyleHeading1
    Add-Paragraph -Text 'Các mục dưới đây được xác định trực tiếp từ luồng và mã nguồn hiện tại. Người test vẫn nên chụp ảnh khi gặp lại, nhưng không cần mất thời gian thử lặp nhiều lần.'
    Add-InfoTable -Headers @('Mã', 'Mức', 'Hiện tượng', 'Ảnh hưởng') -Rows @(
        @('K01', 'Cao', 'Một số nút Đăng nhập ngay dẫn tới /login trong khi route thật là /dang-nhap.', 'Người chưa đăng nhập bị đưa tới trang 404 ở Quản lý lịch và Đánh giá.'),
        @('K02', 'Cao', 'Đặt lịch học thử gửi tham số tutor nhưng trang Đặt lịch chỉ đọc tutorId.', 'Trang báo Không tìm thấy gia sư.'),
        @('K03', 'Cao', 'Analytics đọc localStorage access_token nhưng AuthContext lưu token.', 'Admin có thể đăng nhập đúng nhưng dashboard analytics vẫn bị từ chối.'),
        @('K04', 'Cao', 'Route /admin hiển thị dữ liệu mẫu và không có chặn giao diện theo role.', 'Người thường vẫn mở được màn hình admin mẫu; các nút không quản lý dữ liệu thật.'),
        @('K05', 'Trung bình', 'Avatar trong header dẫn tới /ho-so nhưng App chưa khai báo route này.', 'Bấm hồ sơ cá nhân vào 404.')
    ) -Widths @(1.3, 2.2, 7.0, 5.5) | Out-Null
    Add-PageBreak
    Add-Paragraph -Text 'Vấn đề đã biết tiếp theo' -Style $wdStyleHeading2
    Add-InfoTable -Headers @('Mã', 'Mức', 'Hiện tượng', 'Ảnh hưởng') -Rows @(
        @('K06', 'Trung bình', 'Form Liên hệ chưa có onSubmit.', 'Nội dung không được gửi hoặc lưu.'),
        @('K07', 'Trung bình', 'Ride Hailing chỉ lưu state trong trình duyệt.', 'Chuyến đi mất sau khi tải lại và không xuất hiện trong backend.'),
        @('K08', 'Thấp', 'Nhiều nút như thông báo, nhắn tin, chia sẻ, đăng nhập xã hội và một số bộ lọc Học thử mới là minh họa.', 'Bấm không tạo tác vụ hoàn chỉnh.'),
        @('K09', 'Thấp', 'Tiến độ có phần nhận xét và mục tiêu mẫu cố định.', 'Dễ bị hiểu nhầm là dữ liệu thật của học viên.'),
        @('K10', 'Trung bình', 'Tải tài liệu cập nhật lượt tải và hiện alert nhưng giao diện chưa mở URL file tải xuống.', 'Người dùng có thể không nhận được file dù thao tác báo thành công.')
    ) -Widths @(1.3, 2.2, 7.0, 5.5) | Out-Null

    Add-PageBreak
    Add-Paragraph -Text '6 Mẫu ghi lỗi cho người không chuyên' -Style $wdStyleHeading1
    Add-Paragraph -Text 'Khi gặp lỗi, sao chép mẫu dưới đây và điền càng cụ thể càng tốt. Một lỗi tốt phải giúp người khác làm lại được đúng tình huống.'
    Add-InfoTable -Headers @('Thông tin', 'Nội dung cần ghi') -Rows @(
        @('Tiêu đề', 'Ví dụ  Đặt lịch học thử báo không tìm thấy gia sư'),
        @('Tài khoản', 'Guest, phụ huynh, gia sư hay admin; không ghi mật khẩu'),
        @('Trang và URL', 'Sao chép URL trên thanh địa chỉ'),
        @('Các bước đã làm', 'Ghi lần lượt từng thao tác ngay trước khi lỗi xuất hiện'),
        @('Kết quả mong đợi', 'Bạn cho rằng màn hình phải hiển thị hoặc lưu điều gì'),
        @('Kết quả thực tế', 'Màn hình thực tế, thông báo lỗi hoặc dữ liệu sai'),
        @('Bằng chứng', 'Ảnh chụp toàn màn hình; nếu có thể kèm video ngắn'),
        @('Thời điểm và thiết bị', 'Ngày giờ, Chrome hoặc Edge, máy tính hay điện thoại'),
        @('Mức ảnh hưởng', 'Chặn hoàn toàn, có cách đi vòng, hoặc chỉ sai hiển thị')
    ) -Widths @(4.0, 12.0) | Out-Null

    Add-PageBreak
    Add-Paragraph -Text '7 Biên bản kết thúc vòng test' -Style $wdStyleHeading1
    Add-InfoTable -Headers @('Hạng mục', 'Kết quả') -Rows @(
        @('Môi trường và URL', '____________________________________________'),
        @('Ngày giờ test', '____________________________________________'),
        @('Người test', '____________________________________________'),
        @('Số kịch bản PASS', '________ / 15'),
        @('Số kịch bản FAIL', '________'),
        @('Số kịch bản BLOCKED', '________'),
        @('Lỗi nghiêm trọng cần chặn phát hành', '____________________________________________'),
        @('Kết luận', '[ ] Có thể demo    [ ] Cần sửa trước khi demo    [ ] Cần test lại')
    ) -Widths @(6.0, 10.0) | Out-Null
    Add-Paragraph -Text 'Ưu tiên bắt buộc trước khi demo cho người ngoài' -Style $wdStyleHeading2
    Add-Bullet 'Đăng ký và đăng nhập thành công.'
    Add-Bullet 'Tìm được gia sư, xem đúng hồ sơ và tạo booking.'
    Add-Bullet 'Phụ huynh và gia sư nhìn thấy cùng booking, cập nhật đúng trạng thái.'
    Add-Bullet 'Ứng viên gửi hồ sơ và admin duyệt được.'
    Add-Bullet 'Các đường dẫn đăng nhập, học thử, hồ sơ và analytics không còn lỗi chặn.'

    # Footer with page number
    $footer = $section.Footers.Item(1).Range
    $footer.Text = 'EduConnect  Hướng dẫn kiểm thử thủ công  |  Trang '
    $footer.Font.Name = 'Aptos'
    $footer.Font.Size = 8.5
    $footer.Font.Color = $softGray
    $footer.ParagraphFormat.Alignment = $wdAlignCenter
    $footer.Collapse($wdCollapseEnd)
    $doc.Fields.Add($footer, $wdFieldPage) | Out-Null

    foreach ($table in $doc.Tables) {
        $table.Rows.Item(1).HeadingFormat = $true
    }

    foreach ($p in $doc.Paragraphs) {
        if ($p.Style -eq $doc.Styles.Item($wdStyleHeading1) -or $p.Style -eq $doc.Styles.Item($wdStyleHeading2)) {
            $p.Range.ParagraphFormat.KeepWithNext = $true
        }
    }

    foreach ($tocItem in $doc.TablesOfContents) { $tocItem.Update() }
    $doc.Fields.Update() | Out-Null
    $doc.Repaginate()

    try {
        $doc.BuiltInDocumentProperties.Item('Title').Value = 'Hướng dẫn sử dụng và kiểm thử thủ công EduConnect'
        $doc.BuiltInDocumentProperties.Item('Subject').Value = 'Manual test cho người không chuyên'
        $doc.BuiltInDocumentProperties.Item('Author').Value = 'EduConnect Team'
    } catch {
        # Some Office builds do not expose built-in properties through COM.
    }

    $doc.SaveAs2($OutputPath, 16)
    $doc.Close($false)
    $word.Quit()
    Write-Output $OutputPath
}
finally {
    if ($doc -ne $null) {
        try { $doc.Close($false) } catch {}
        try { [void][Runtime.InteropServices.Marshal]::ReleaseComObject($doc) } catch {}
    }
    if ($word -ne $null) {
        try { $word.Quit() } catch {}
        try { [void][Runtime.InteropServices.Marshal]::ReleaseComObject($word) } catch {}
    }
    [GC]::Collect()
    [GC]::WaitForPendingFinalizers()
}
