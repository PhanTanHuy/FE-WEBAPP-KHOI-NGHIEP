$ErrorActionPreference = 'Stop'

$outputPath = Join-Path (Get-Location) 'docs\EDUCONNECT_THIET_KE_VAI_TRO.docx'
$word = $null
$doc = $null

function Set-RunFont {
    param($Range, [double]$Size = 11, [bool]$Bold = $false, [int]$Color = 0)
    $Range.Font.Name = 'Arial'
    $Range.Font.Size = $Size
    $Range.Font.Bold = [int]$Bold
    $Range.Font.Color = $Color
}

function Add-Paragraph {
    param(
        [string]$Text,
        [string]$Style = 'Normal',
        [double]$SpaceAfter = 6,
        [int]$KeepWithNext = 0,
        [switch]$PassThru
    )
    $p = $doc.Paragraphs.Add()
    $p.Range.Text = $Text
    $p.Range.Style = $Style
    $p.Format.SpaceAfter = $SpaceAfter
    $p.Format.KeepWithNext = $KeepWithNext
    Set-RunFont -Range $p.Range -Size 11
    if ($PassThru) { return $p }
}

function Add-Bullet {
    param([string]$Text)
    $p = $doc.Paragraphs.Add()
    $p.Range.Text = $Text
    [void]$p.Range.ListFormat.ApplyBulletDefault()
    $p.Format.LeftIndent = $word.CentimetersToPoints(0.65)
    $p.Format.FirstLineIndent = $word.CentimetersToPoints(-0.3)
    $p.Format.SpaceAfter = 3
    Set-RunFont -Range $p.Range -Size 10.5
}

function Set-CellPadding {
    param($Table)
    $Table.TopPadding = $word.CentimetersToPoints(0.16)
    $Table.BottomPadding = $word.CentimetersToPoints(0.16)
    $Table.LeftPadding = $word.CentimetersToPoints(0.18)
    $Table.RightPadding = $word.CentimetersToPoints(0.18)
}

function Add-Table {
    param([array]$Headers, [array]$Rows, [array]$Widths)
    $range = $doc.Range($doc.Content.End - 1, $doc.Content.End - 1)
    $table = $doc.Tables.Add($range, $Rows.Count + 1, $Headers.Count)
    $table.Borders.Enable = 1
    $table.Rows.AllowBreakAcrossPages = 0
    $table.Rows.Item(1).HeadingFormat = -1
    Set-CellPadding -Table $table

    for ($c = 1; $c -le $Headers.Count; $c++) {
        $cell = $table.Cell(1, $c)
        $cell.Range.Text = $Headers[$c - 1]
        $cell.Shading.BackgroundPatternColor = 8210719
        Set-RunFont -Range $cell.Range -Size 9.5 -Bold $true -Color 16777215
        $cell.Range.ParagraphFormat.Alignment = 1
        $cell.VerticalAlignment = 1
        if ($Widths) { $cell.Width = $word.CentimetersToPoints($Widths[$c - 1]) }
    }

    for ($r = 1; $r -le $Rows.Count; $r++) {
        for ($c = 1; $c -le $Headers.Count; $c++) {
            $cell = $table.Cell($r + 1, $c)
            $cell.Range.Text = [string]$Rows[$r - 1][$c - 1]
            Set-RunFont -Range $cell.Range -Size 9.2
            $cell.Range.ParagraphFormat.SpaceAfter = 0
            $cell.Range.ParagraphFormat.LineSpacingRule = 0
            $cell.VerticalAlignment = 1
            if (($r % 2) -eq 0) { $cell.Shading.BackgroundPatternColor = 16119285 }
            if ($Widths) { $cell.Width = $word.CentimetersToPoints($Widths[$c - 1]) }
        }
    }

    $after = $doc.Paragraphs.Add($doc.Range($doc.Content.End - 1, $doc.Content.End - 1))
    $after.Format.SpaceAfter = 6
    return $table
}

try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    $word.DisplayAlerts = 0
    $doc = $word.Documents.Add()

    $section = $doc.Sections.Item(1)
    $section.PageSetup.TopMargin = $word.CentimetersToPoints(1.8)
    $section.PageSetup.BottomMargin = $word.CentimetersToPoints(1.7)
    $section.PageSetup.LeftMargin = $word.CentimetersToPoints(2.0)
    $section.PageSetup.RightMargin = $word.CentimetersToPoints(2.0)

    $normal = $doc.Styles.Item('Normal')
    $normal.Font.Name = 'Arial'
    $normal.Font.Size = 11
    $normal.ParagraphFormat.SpaceAfter = 6
    $normal.ParagraphFormat.LineSpacingRule = 0

    $titleStyle = $doc.Styles.Item('Title')
    $titleStyle.Font.Name = 'Arial'
    $titleStyle.Font.Size = 24
    $titleStyle.Font.Bold = -1
    $titleStyle.Font.Color = 0
    $titleStyle.ParagraphFormat.SpaceAfter = 10

    foreach ($styleName in @('Heading 1', 'Heading 2')) {
        $style = $doc.Styles.Item($styleName)
        $style.Font.Name = 'Arial'
        $style.Font.Color = 0
        $style.Font.Bold = -1
        $style.ParagraphFormat.KeepWithNext = -1
    }
    $doc.Styles.Item('Heading 1').Font.Size = 16
    $doc.Styles.Item('Heading 1').ParagraphFormat.SpaceBefore = 12
    $doc.Styles.Item('Heading 1').ParagraphFormat.SpaceAfter = 6
    $doc.Styles.Item('Heading 2').Font.Size = 12.5
    $doc.Styles.Item('Heading 2').ParagraphFormat.SpaceBefore = 8
    $doc.Styles.Item('Heading 2').ParagraphFormat.SpaceAfter = 4

    $title = Add-Paragraph -Text 'Thiết kế vai trò và chức năng EduConnect' -Style 'Title' -SpaceAfter 8 -PassThru
    $subtitle = Add-Paragraph -Text 'Đề xuất phân quyền ngắn gọn cho phiên bản tiếp theo' -SpaceAfter 14 -PassThru
    $subtitle.Range.Font.Size = 12
    $subtitle.Range.Font.Italic = -1
    $subtitle.Range.Font.Color = 6250335

    Add-Paragraph -Text 'EduConnect nên có năm nhóm người dùng: Khách, Tài khoản gia đình, Giáo viên, Quản lý hệ thống và Quản trị viên. Tài khoản gia đình dùng chung thông tin đăng nhập nhưng tách hồ sơ phụ huynh và từng học sinh để lịch học, tiến độ và quyền riêng tư không bị lẫn.' -SpaceAfter 8

    Add-Paragraph -Text 'Nguyên tắc phân quyền' -Style 'Heading 1' -KeepWithNext -1
    Add-Bullet 'Mỗi người chỉ thấy dữ liệu và thao tác cần cho công việc của mình.'
    Add-Bullet 'Phụ huynh là chủ tài khoản gia đình; học sinh dùng hồ sơ riêng bên trong tài khoản.'
    Add-Bullet 'Quản lý hệ thống xử lý vận hành hằng ngày; Quản trị viên kiểm soát quyền, bảo mật và cấu hình toàn hệ thống.'
    Add-Bullet 'Các thao tác nhạy cảm phải được ghi nhật ký để có thể kiểm tra lại.'

    Add-Paragraph -Text 'Tổng quan các vai trò' -Style 'Heading 1' -KeepWithNext -1
    Add-Table -Headers @('Vai trò', 'Mục đích', 'Phạm vi chính') -Widths @(3.2, 5.1, 8.0) -Rows @(
        @('Khách', 'Tìm hiểu dịch vụ trước khi đăng ký', 'Xem thông tin công khai, tìm giáo viên, xem tài liệu mẫu và đăng ký tài khoản'),
        @('Tài khoản gia đình', 'Quản lý việc học của một hoặc nhiều học sinh', 'Đặt lịch, thanh toán, theo dõi tiến độ, học tập và trao đổi với giáo viên'),
        @('Giáo viên', 'Cung cấp và quản lý hoạt động dạy học', 'Hồ sơ chuyên môn, lịch dạy, lớp học, tài liệu, tiến độ và thu nhập'),
        @('Quản lý hệ thống', 'Vận hành nền tảng hằng ngày', 'Duyệt nội dung, hỗ trợ người dùng, xử lý sự cố và xem báo cáo vận hành'),
        @('Quản trị viên', 'Kiểm soát toàn bộ hệ thống', 'Phân quyền, bảo mật, cấu hình, nhật ký, tích hợp và dữ liệu toàn hệ thống')
    ) | Out-Null

    Add-Paragraph -Text 'Chức năng theo từng vai trò' -Style 'Heading 1' -KeepWithNext -1

    Add-Paragraph -Text 'Khách chưa đăng ký' -Style 'Heading 2' -KeepWithNext -1
    Add-Bullet 'Xem trang giới thiệu, dịch vụ, bảng giá, câu hỏi thường gặp và thông tin liên hệ.'
    Add-Bullet 'Tìm kiếm, lọc và xem hồ sơ công khai của giáo viên.'
    Add-Bullet 'Xem trước tài liệu miễn phí và đánh giá công khai.'
    Add-Bullet 'Đăng ký, đăng nhập hoặc gửi yêu cầu tư vấn.'
    Add-Bullet 'Không được đặt lịch, nhắn tin, tải tài liệu giới hạn hoặc xem dữ liệu cá nhân.'

    Add-Paragraph -Text 'Tài khoản gia đình gồm phụ huynh và học sinh' -Style 'Heading 2' -KeepWithNext -1
    Add-Bullet 'Dùng một tài khoản đăng nhập; tạo nhiều hồ sơ học sinh trong gia đình.'
    Add-Bullet 'Phụ huynh quản lý thông tin gia đình, lịch học, đặt lịch, thanh toán, hoàn tiền và dịch vụ đưa đón.'
    Add-Bullet 'Phụ huynh xem tiến độ, nhận xét, điểm số, bài tập và thông báo của từng học sinh.'
    Add-Bullet 'Học sinh chọn hồ sơ của mình để xem lịch, vào buổi học, nhận tài liệu, nộp bài và xem tiến độ cá nhân.'
    Add-Bullet 'Phụ huynh quyết định học sinh có được tự nhắn tin, đặt lịch hoặc xem chi phí hay không.'
    Add-Bullet 'Gia đình có thể đánh giá giáo viên sau buổi học, lưu giáo viên yêu thích và gửi yêu cầu hỗ trợ.'

    Add-Paragraph -Text 'Giáo viên' -Style 'Heading 2' -KeepWithNext -1
    Add-Bullet 'Đăng ký hồ sơ, xác minh danh tính, bằng cấp và chứng chỉ.'
    Add-Bullet 'Quản lý môn dạy, cấp học, học phí, hình thức dạy, khu vực và lịch rảnh.'
    Add-Bullet 'Nhận, xác nhận, đề nghị đổi lịch hoặc từ chối yêu cầu đặt học.'
    Add-Bullet 'Quản lý danh sách học sinh, điểm danh, nội dung buổi học và báo cáo tiến độ.'
    Add-Bullet 'Giao bài, nhận bài nộp, chia sẻ tài liệu và phản hồi cho học sinh.'
    Add-Bullet 'Nhắn tin với gia đình, nhận thông báo và xử lý yêu cầu hỗ trợ liên quan đến lớp học.'
    Add-Bullet 'Xem doanh thu, lịch sử thanh toán, phí nền tảng và yêu cầu rút tiền.'

    Add-Paragraph -Text 'Quản lý hệ thống' -Style 'Heading 2' -KeepWithNext -1
    Add-Bullet 'Duyệt hoặc từ chối hồ sơ giáo viên, chứng chỉ và tài liệu học tập.'
    Add-Bullet 'Quản lý người dùng ở mức vận hành: xác minh, cảnh báo, tạm khóa và mở khóa theo quy trình.'
    Add-Bullet 'Theo dõi đặt lịch, thanh toán, hoàn tiền, khiếu nại và các trường hợp cần hỗ trợ.'
    Add-Bullet 'Quản lý danh mục môn học, cấp học, khu vực, nội dung trang và thông báo chung.'
    Add-Bullet 'Xem báo cáo lượt truy cập, tìm kiếm, nhấp chuột, đặt lịch, doanh thu và chất lượng dịch vụ.'
    Add-Bullet 'Không được tự cấp quyền Quản trị viên, xem khóa bí mật hoặc thay đổi cấu hình bảo mật quan trọng.'

    Add-Paragraph -Text 'Quản trị viên' -Style 'Heading 2' -KeepWithNext -1
    Add-Bullet 'Tạo và thu hồi tài khoản Quản lý hệ thống; gán hoặc thay đổi vai trò.'
    Add-Bullet 'Thiết lập chính sách quyền, xác thực hai bước, thời hạn phiên đăng nhập và giới hạn truy cập.'
    Add-Bullet 'Quản lý cấu hình hệ thống, tích hợp thanh toán, email, lưu trữ và dịch vụ bên thứ ba.'
    Add-Bullet 'Xem nhật ký hoạt động, cảnh báo bảo mật, sao lưu và tình trạng hệ thống.'
    Add-Bullet 'Khóa, khôi phục hoặc xóa tài khoản trong trường hợp đặc biệt; xuất dữ liệu khi có yêu cầu hợp lệ.'
    Add-Bullet 'Có toàn quyền nhưng mọi thao tác nhạy cảm vẫn phải lưu nhật ký và yêu cầu xác nhận lại.'

    Add-Paragraph -Text 'Phân quyền trong tài khoản gia đình' -Style 'Heading 1' -KeepWithNext -1
    Add-Table -Headers @('Chức năng', 'Phụ huynh', 'Học sinh') -Widths @(8.5, 3.8, 4.0) -Rows @(
        @('Quản lý hồ sơ gia đình và thêm học sinh', 'Có', 'Không'),
        @('Đặt lịch và thay đổi lịch học', 'Có', 'Theo cho phép'),
        @('Thanh toán, hoàn tiền và xem chi phí', 'Có', 'Không'),
        @('Xem lịch và tham gia buổi học', 'Có', 'Có'),
        @('Xem tiến độ, bài tập và tài liệu', 'Có', 'Chỉ hồ sơ của mình'),
        @('Nhắn tin với giáo viên', 'Có', 'Theo cho phép'),
        @('Đánh giá giáo viên', 'Có', 'Có thể góp ý')
    ) | Out-Null

    Add-Paragraph -Text 'Chức năng nên bổ sung' -Style 'Heading 1' -KeepWithNext -1
    Add-Table -Headers @('Ưu tiên', 'Chức năng', 'Lý do') -Widths @(2.4, 6.1, 7.8) -Rows @(
        @('Cao', 'Hồ sơ gia đình và hồ sơ học sinh', 'Cho phép dùng chung tài khoản mà dữ liệu học tập vẫn tách rõ'),
        @('Cao', 'Phân quyền chuẩn và nhật ký thao tác', 'Ngăn truy cập sai và biết ai đã thay đổi dữ liệu'),
        @('Cao', 'Thông báo và nhắn tin', 'Giảm bỏ lỡ lịch học, bài tập và phản hồi'),
        @('Cao', 'Thanh toán, hoàn tiền và thu nhập giáo viên', 'Hoàn chỉnh quy trình đặt học'),
        @('Trung bình', 'Bài tập và phòng học trực tuyến', 'Hỗ trợ toàn bộ quá trình học trên nền tảng'),
        @('Trung bình', 'Khiếu nại, báo xấu và trung tâm hỗ trợ', 'Giúp xử lý tranh chấp và bảo vệ người dùng'),
        @('Trung bình', 'Xuất hoặc xóa dữ liệu cá nhân', 'Tăng quyền kiểm soát dữ liệu của người dùng'),
        @('Sau', 'Mã giảm giá, gói học và giới thiệu bạn bè', 'Hỗ trợ tăng trưởng sau khi luồng chính đã ổn định')
    ) | Out-Null

    Add-Paragraph -Text 'Thứ tự triển khai đề xuất' -Style 'Heading 1' -KeepWithNext -1
    Add-Paragraph -Text 'Giai đoạn 1: Chuẩn hóa năm vai trò, quyền truy cập, hồ sơ gia đình và nhật ký thao tác.' -SpaceAfter 4
    Add-Paragraph -Text 'Giai đoạn 2: Hoàn thiện đặt lịch, thanh toán, thông báo, nhắn tin và quy trình dạy học.' -SpaceAfter 4
    Add-Paragraph -Text 'Giai đoạn 3: Bổ sung hỗ trợ, khiếu nại, báo cáo nâng cao và các tính năng tăng trưởng.' -SpaceAfter 8

    Add-Paragraph -Text 'Kết luận' -Style 'Heading 1' -KeepWithNext -1
    Add-Paragraph -Text 'Mô hình này giữ trải nghiệm đơn giản cho gia đình nhưng vẫn tách dữ liệu của từng học sinh. Hai vai trò nội bộ được phân biệt rõ: Quản lý hệ thống vận hành hằng ngày, còn Quản trị viên chịu trách nhiệm về quyền hạn, bảo mật và cấu hình toàn nền tảng.' -SpaceAfter 0

    $footer = $section.Footers.Item(1)
    $footer.Range.Text = 'EduConnect | Thiết kế vai trò và chức năng'
    Set-RunFont -Range $footer.Range -Size 8.5 -Color 7566195
    $footer.Range.ParagraphFormat.Alignment = 1

    $doc.SaveAs2($outputPath, 16)
    Write-Output $outputPath
}
finally {
    if ($doc) { $doc.Close($false) }
    if ($word) { $word.Quit() }
    if ($doc) { [void][System.Runtime.InteropServices.Marshal]::ReleaseComObject($doc) }
    if ($word) { [void][System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) }
    [GC]::Collect()
    [GC]::WaitForPendingFinalizers()
}
