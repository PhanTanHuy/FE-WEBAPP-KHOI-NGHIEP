from copy import deepcopy
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "docs" / "EDUCONNECT_HUONG_DAN_TEST_MANUAL.docx"
OUTPUT = ROOT / "docs" / "EDUCONNECT_THIET_KE_VAI_TRO.docx"
W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
NS = {"w": W}
ET.register_namespace("w", W)


def q(tag):
    return f"{{{W}}}{tag}"


def paragraph(text="", style=None, bold=False, italic=False, size=None, color=None):
    p = ET.Element(q("p"))
    if style:
        ppr = ET.SubElement(p, q("pPr"))
        ET.SubElement(ppr, q("pStyle"), {q("val"): style})
    r = ET.SubElement(p, q("r"))
    rpr = ET.SubElement(r, q("rPr"))
    ET.SubElement(rpr, q("rFonts"), {q("ascii"): "Arial", q("hAnsi"): "Arial", q("eastAsia"): "Arial"})
    if bold:
        ET.SubElement(rpr, q("b"))
    if italic:
        ET.SubElement(rpr, q("i"))
    if size:
        ET.SubElement(rpr, q("sz"), {q("val"): str(size * 2)})
    if color:
        ET.SubElement(rpr, q("color"), {q("val"): color})
    t = ET.SubElement(r, q("t"))
    t.text = text
    return p


def table(headers, rows, widths):
    tbl = ET.Element(q("tbl"))
    tblpr = ET.SubElement(tbl, q("tblPr"))
    ET.SubElement(tblpr, q("tblStyle"), {q("val"): "TableGrid"})
    ET.SubElement(tblpr, q("tblW"), {q("w"): "0", q("type"): "auto"})
    grid = ET.SubElement(tbl, q("tblGrid"))
    for width in widths:
        ET.SubElement(grid, q("gridCol"), {q("w"): str(width)})

    def add_row(values, header=False, shade=False):
        tr = ET.SubElement(tbl, q("tr"))
        if header:
            trpr = ET.SubElement(tr, q("trPr"))
            ET.SubElement(trpr, q("tblHeader"))
        for idx, value in enumerate(values):
            tc = ET.SubElement(tr, q("tc"))
            tcpr = ET.SubElement(tc, q("tcPr"))
            ET.SubElement(tcpr, q("tcW"), {q("w"): str(widths[idx]), q("type"): "dxa"})
            if header or shade:
                ET.SubElement(tcpr, q("shd"), {q("fill"): "1F4E78" if header else "EAF2F8"})
            tc.append(paragraph(str(value), bold=header, size=9, color="FFFFFF" if header else None))

    add_row(headers, header=True)
    for idx, row in enumerate(rows):
        add_row(row, shade=idx % 2 == 1)
    return tbl


sections = [
    ("Khách chưa đăng ký", [
        "Xem giới thiệu, dịch vụ, bảng giá, câu hỏi thường gặp và thông tin liên hệ.",
        "Tìm kiếm, lọc và xem hồ sơ công khai của giáo viên.",
        "Xem trước tài liệu miễn phí và đánh giá công khai.",
        "Đăng ký, đăng nhập hoặc gửi yêu cầu tư vấn.",
        "Không được đặt lịch, nhắn tin hoặc xem dữ liệu cá nhân.",
    ]),
    ("Tài khoản gia đình gồm phụ huynh và học sinh", [
        "Dùng một tài khoản đăng nhập; tạo nhiều hồ sơ học sinh trong gia đình.",
        "Phụ huynh quản lý hồ sơ, đặt lịch, thanh toán, hoàn tiền và dịch vụ đưa đón.",
        "Phụ huynh xem tiến độ, nhận xét, điểm số, bài tập và thông báo của từng học sinh.",
        "Học sinh xem lịch, vào buổi học, nhận tài liệu, nộp bài và xem tiến độ của mình.",
        "Phụ huynh quyết định học sinh có được tự nhắn tin, đặt lịch hoặc xem chi phí hay không.",
        "Gia đình đánh giá giáo viên, lưu giáo viên yêu thích và gửi yêu cầu hỗ trợ.",
    ]),
    ("Giáo viên", [
        "Đăng ký hồ sơ, xác minh danh tính, bằng cấp và chứng chỉ.",
        "Quản lý môn dạy, học phí, hình thức dạy, khu vực và lịch rảnh.",
        "Nhận, xác nhận, đổi lịch hoặc từ chối yêu cầu đặt học.",
        "Quản lý học sinh, điểm danh, nội dung buổi học và báo cáo tiến độ.",
        "Giao bài, nhận bài nộp, chia sẻ tài liệu và phản hồi.",
        "Nhắn tin với gia đình; xem doanh thu, phí nền tảng và yêu cầu rút tiền.",
    ]),
    ("Quản lý hệ thống", [
        "Duyệt hoặc từ chối hồ sơ giáo viên, chứng chỉ và tài liệu.",
        "Xác minh, cảnh báo, tạm khóa và mở khóa người dùng theo quy trình.",
        "Theo dõi đặt lịch, thanh toán, hoàn tiền, khiếu nại và hỗ trợ.",
        "Quản lý môn học, cấp học, khu vực, nội dung trang và thông báo chung.",
        "Xem báo cáo truy cập, tìm kiếm, lượt nhấp, đặt lịch, doanh thu và chất lượng.",
        "Không được tự cấp quyền Quản trị viên hoặc đổi cấu hình bảo mật quan trọng.",
    ]),
    ("Quản trị viên", [
        "Tạo và thu hồi tài khoản Quản lý hệ thống; gán hoặc thay đổi vai trò.",
        "Thiết lập quyền, xác thực hai bước, thời hạn đăng nhập và giới hạn truy cập.",
        "Quản lý cấu hình, thanh toán, email, lưu trữ và dịch vụ tích hợp.",
        "Xem nhật ký hoạt động, cảnh báo bảo mật, sao lưu và tình trạng hệ thống.",
        "Khóa, khôi phục hoặc xóa tài khoản trong trường hợp đặc biệt.",
        "Mọi thao tác nhạy cảm phải lưu nhật ký và yêu cầu xác nhận lại.",
    ]),
]

with ZipFile(SOURCE, "r") as src:
    xml = src.read("word/document.xml")
    root = ET.fromstring(xml)
    body = root.find("w:body", NS)
    sect_pr = deepcopy(body.find("w:sectPr", NS))
    for child in list(body):
        body.remove(child)

    body.append(paragraph("Thiết kế vai trò và chức năng EduConnect", "Title", bold=True, size=23))
    body.append(paragraph("Đề xuất phân quyền ngắn gọn cho phiên bản tiếp theo", italic=True, size=12, color="595959"))
    body.append(paragraph(
        "EduConnect nên có năm nhóm người dùng: Khách, Tài khoản gia đình, Giáo viên, Quản lý hệ thống và Quản trị viên. "
        "Tài khoản gia đình dùng chung thông tin đăng nhập nhưng tách hồ sơ phụ huynh và từng học sinh."
    ))

    body.append(paragraph("Nguyên tắc phân quyền", "Heading1", bold=True, size=16))
    for text in [
        "• Mỗi người chỉ thấy dữ liệu và thao tác cần cho vai trò của mình.",
        "• Phụ huynh là chủ tài khoản gia đình; mỗi học sinh có hồ sơ riêng.",
        "• Quản lý hệ thống vận hành hằng ngày; Quản trị viên quản lý quyền, bảo mật và cấu hình.",
        "• Mọi thao tác nhạy cảm phải được ghi nhật ký.",
    ]:
        body.append(paragraph(text))

    body.append(paragraph("Tổng quan các vai trò", "Heading1", bold=True, size=16))
    body.append(table(["Vai trò", "Mục đích", "Phạm vi chính"], [
        ["Khách", "Tìm hiểu trước khi đăng ký", "Xem thông tin công khai, tìm giáo viên và đăng ký"],
        ["Tài khoản gia đình", "Quản lý việc học", "Đặt lịch, thanh toán, học tập và theo dõi tiến độ"],
        ["Giáo viên", "Cung cấp hoạt động dạy học", "Hồ sơ, lịch dạy, lớp học, tài liệu và thu nhập"],
        ["Quản lý hệ thống", "Vận hành hằng ngày", "Duyệt nội dung, hỗ trợ, xử lý sự cố và báo cáo"],
        ["Quản trị viên", "Kiểm soát hệ thống", "Phân quyền, bảo mật, cấu hình, nhật ký và tích hợp"],
    ], [1800, 2800, 4700]))

    body.append(paragraph("Chức năng theo từng vai trò", "Heading1", bold=True, size=16))
    for heading, bullets in sections:
        body.append(paragraph(heading, "Heading2", bold=True, size=13))
        for text in bullets:
            body.append(paragraph("• " + text))

    body.append(paragraph("Phân quyền trong tài khoản gia đình", "Heading1", bold=True, size=16))
    body.append(table(["Chức năng", "Phụ huynh", "Học sinh"], [
        ["Quản lý hồ sơ gia đình và thêm học sinh", "Có", "Không"],
        ["Đặt hoặc thay đổi lịch học", "Có", "Theo cho phép"],
        ["Thanh toán, hoàn tiền và xem chi phí", "Có", "Không"],
        ["Xem lịch và tham gia buổi học", "Có", "Có"],
        ["Xem tiến độ, bài tập và tài liệu", "Có", "Chỉ hồ sơ của mình"],
        ["Nhắn tin với giáo viên", "Có", "Theo cho phép"],
    ], [5200, 1900, 2200]))

    body.append(paragraph("Chức năng nên bổ sung", "Heading1", bold=True, size=16))
    body.append(table(["Ưu tiên", "Chức năng", "Lý do"], [
        ["Cao", "Hồ sơ gia đình và học sinh", "Dùng chung tài khoản nhưng dữ liệu vẫn tách rõ"],
        ["Cao", "Phân quyền và nhật ký thao tác", "Ngăn truy cập sai và truy vết thay đổi"],
        ["Cao", "Thông báo và nhắn tin", "Giảm bỏ lỡ lịch học, bài tập và phản hồi"],
        ["Cao", "Thanh toán, hoàn tiền và thu nhập", "Hoàn chỉnh quy trình đặt học"],
        ["Trung bình", "Bài tập và phòng học trực tuyến", "Hỗ trợ toàn bộ quá trình học"],
        ["Trung bình", "Khiếu nại, báo xấu và hỗ trợ", "Xử lý tranh chấp và bảo vệ người dùng"],
        ["Sau", "Mã giảm giá và gói học", "Bổ sung sau khi luồng chính ổn định"],
    ], [1400, 3500, 4400]))

    body.append(paragraph("Thứ tự triển khai đề xuất", "Heading1", bold=True, size=16))
    for text in [
        "Giai đoạn 1: Chuẩn hóa năm vai trò, hồ sơ gia đình, quyền truy cập và nhật ký.",
        "Giai đoạn 2: Hoàn thiện đặt lịch, thanh toán, thông báo, nhắn tin và dạy học.",
        "Giai đoạn 3: Bổ sung hỗ trợ, khiếu nại, báo cáo nâng cao và tính năng tăng trưởng.",
    ]:
        body.append(paragraph("• " + text))

    body.append(paragraph("Kết luận", "Heading1", bold=True, size=16))
    body.append(paragraph(
        "Mô hình này giữ trải nghiệm đơn giản cho gia đình nhưng vẫn tách dữ liệu từng học sinh. "
        "Quản lý hệ thống phụ trách vận hành; Quản trị viên chịu trách nhiệm về quyền, bảo mật và cấu hình."
    ))
    body.append(sect_pr)
    new_xml = ET.tostring(root, encoding="utf-8", xml_declaration=True)

    with ZipFile(OUTPUT, "w", ZIP_DEFLATED) as dst:
        for item in src.infolist():
            data = new_xml if item.filename == "word/document.xml" else src.read(item.filename)
            dst.writestr(item, data)

print(OUTPUT)
