import sys
import os
from datetime import datetime, time

# Add parent directory to sys.path so app can be imported
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal, engine, Base
from app.models.models import (
    User, Subject, Level, Location, TutorProfile,
    TutorEducation, TutorCertificate, TutorAvailability, Review
)

# Mock Subjects from subjects.js
SUBJECTS_DATA = [
    {"slug": "toan", "name": "Toán", "icon": "📐", "color": "#3B82F6"},
    {"slug": "van", "name": "Ngữ văn", "icon": "📖", "color": "#8B5CF6"},
    {"slug": "anh", "name": "Tiếng Anh", "icon": "🌍", "color": "#10B981"},
    {"slug": "ly", "name": "Vật lý", "icon": "⚡", "color": "#F59E0B"},
    {"slug": "hoa", "name": "Hóa học", "icon": "🧪", "color": "#EF4444"},
    {"slug": "sinh", "name": "Sinh học", "icon": "🌿", "color": "#059669"},
    {"slug": "su", "name": "Lịch sử", "icon": "🏛️", "color": "#92400E"},
    {"slug": "dia", "name": "Địa lý", "icon": "🗺️", "color": "#0284C7"},
    {"slug": "tin", "name": "Tin học", "icon": "💻", "color": "#6366F1"},
    {"slug": "lap-trinh", "name": "Lập trình", "icon": "🖥️", "color": "#7C3AED"},
    {"slug": "kinh-te", "name": "Kinh tế", "icon": "📊", "color": "#D97706"},
    {"slug": "am-nhac", "name": "Âm nhạc", "icon": "🎵", "color": "#EC4899"}
]

# Mock Levels from subjects.js
LEVELS_DATA = [
    {"slug": "tieu-hoc", "name": "Tiểu học", "grades": "Lớp 1-5"},
    {"slug": "thcs", "name": "THCS", "grades": "Lớp 6-9"},
    {"slug": "thpt", "name": "THPT", "grades": "Lớp 10-12"},
    {"slug": "dai-hoc", "name": "Đại học", "grades": "Năm 1-4"},
    {"slug": "nguoi-di-lam", "name": "Người đi làm", "grades": "Mọi độ tuổi"}
]

# Mock Tutors from tutors.js
TUTORS_DATA = [
    {
        "id": 1,
        "name": "Nguyễn Thị Minh Anh",
        "email": "minhanh.nguyen@educonnect.vn",
        "phone": "0987654321",
        "avatar": "https://i.pravatar.cc/150?img=47",
        "title": "Thạc sĩ Toán học - ĐH Bách Khoa HN",
        "subjects": ["Toán", "Vật lý"],
        "levels": ["THCS", "THPT"],
        "rating": 4.9,
        "reviewCount": 128,
        "pricePerHour": 250000,
        "district": "Cầu Giấy",
        "city": "Hà Nội",
        "teachingMode": "both",
        "verified": True,
        "status": "approved",
        "experience": 6,
        "bio": "Tôi là giáo viên Toán với 6 năm kinh nghiệm giảng dạy tại các trường THPT và luyện thi đại học. Chuyên luyện thi vào các trường chuyên và ôn thi THPTQG môn Toán, Vật lý.",
        "education": [
            {"degree": "Thạc sĩ", "major": "Toán học ứng dụng", "school": "ĐH Bách Khoa Hà Nội", "year": 2020},
            {"degree": "Cử nhân", "major": "Sư phạm Toán", "school": "ĐH Sư phạm Hà Nội", "year": 2018}
        ],
        "certifications": ["Chứng chỉ sư phạm", "IELTS 7.0"],
        "schedule": {
            "Mon": ["18:00-20:00", "20:00-22:00"],
            "Wed": ["18:00-20:00"],
            "Fri": ["18:00-20:00", "20:00-22:00"],
            "Sat": ["08:00-10:00", "10:00-12:00", "14:00-16:00"],
            "Sun": ["08:00-10:00", "14:00-16:00"]
        },
        "reviews": [
            {"studentName": "Trần Văn Nam", "studentEmail": "nam.tv@gmail.com", "rating": 5, "comment": "Cô dạy rất dễ hiểu, kiên nhẫn và nhiệt tình. Con tôi từ 5 điểm lên 9 điểm sau 3 tháng học.", "date": "2024-10-15", "avatar": "https://i.pravatar.cc/150?img=12"},
            {"studentName": "Lê Thị Hoa", "studentEmail": "hoa.lt@gmail.com", "rating": 5, "comment": "Gia sư tuyệt vời! Cách giảng bài rõ ràng, có hệ thống. Rất khuyến khích.", "date": "2024-09-20", "avatar": "https://i.pravatar.cc/150?img=25"},
            {"studentName": "Phạm Minh Tuấn", "studentEmail": "tuan.pm@gmail.com", "rating": 4, "comment": "Dạy tốt, đúng giờ. Cô có nhiều bài tập hay để luyện thêm.", "date": "2024-08-10", "avatar": "https://i.pravatar.cc/150?img=33"}
        ],
        "completedLessons": 312,
        "studentCount": 45
    },
    {
        "id": 2,
        "name": "Trần Đức Mạnh",
        "email": "ducmanh.tran@educonnect.vn",
        "phone": "0987654322",
        "avatar": "https://i.pravatar.cc/150?img=68",
        "title": "Cử nhân Anh văn - ĐH Ngoại ngữ HN",
        "subjects": ["Tiếng Anh"],
        "levels": ["Tiểu học", "THCS", "THPT", "Người đi làm"],
        "rating": 4.8,
        "reviewCount": 96,
        "pricePerHour": 200000,
        "district": "Đống Đa",
        "city": "Hà Nội",
        "teachingMode": "both",
        "verified": True,
        "status": "approved",
        "experience": 4,
        "bio": "Tốt nghiệp ĐH Ngoại ngữ HN, IELTS 8.0. Giảng dạy tiếng Anh cho mọi lứa tuổi từ giao tiếp cơ bản đến luyện thi IELTS/TOEIC. Phương pháp dạy học vui vẻ, hiệu quả.",
        "education": [
            {"degree": "Cử nhân", "major": "Ngôn ngữ Anh", "school": "ĐH Ngoại ngữ Hà Nội", "year": 2020}
        ],
        "certifications": ["IELTS 8.0", "TOEIC 990", "Chứng chỉ TESOL"],
        "schedule": {
            "Tue": ["19:00-21:00"],
            "Thu": ["19:00-21:00"],
            "Sat": ["08:00-10:00", "10:00-12:00"],
            "Sun": ["14:00-16:00", "16:00-18:00"]
        },
        "reviews": [
            {"studentName": "Ngô Thị Lan", "studentEmail": "lan.ngo@gmail.com", "rating": 5, "comment": "Thầy dạy IELTS rất hay, phương pháp hiện đại. Tôi đã đạt 7.0 sau 4 tháng.", "date": "2024-11-01", "avatar": "https://i.pravatar.cc/150?img=45"},
            {"studentName": "Hoàng Văn An", "studentEmail": "an.hoang@gmail.com", "rating": 5, "comment": "Rất hài lòng với cách dạy của thầy. Phát âm chuẩn, giao tiếp tự nhiên.", "date": "2024-10-05", "avatar": "https://i.pravatar.cc/150?img=18"}
        ],
        "completedLessons": 240,
        "studentCount": 38
    },
    {
        "id": 3,
        "name": "Phạm Thị Thu Hương",
        "email": "thuhuong.pham@educonnect.vn",
        "phone": "0987654323",
        "avatar": "https://i.pravatar.cc/150?img=56",
        "title": "Thạc sĩ Hóa học - ĐH KHTN HN",
        "subjects": ["Hóa học", "Sinh học"],
        "levels": ["THCS", "THPT"],
        "rating": 4.7,
        "reviewCount": 74,
        "pricePerHour": 230000,
        "district": "Hoàng Mai",
        "city": "Hà Nội",
        "teachingMode": "offline",
        "verified": True,
        "status": "approved",
        "experience": 5,
        "bio": "Thạc sĩ Hóa học, có 5 năm kinh nghiệm dạy kèm và luyện thi. Chuyên luyện thi vào lớp 10 và THPTQG môn Hóa, Sinh.",
        "education": [
            {"degree": "Thạc sĩ", "major": "Hóa học", "school": "ĐH Khoa học Tự nhiên HN", "year": 2021}
        ],
        "certifications": ["Chứng chỉ sư phạm"],
        "schedule": {
            "Mon": ["17:00-19:00"],
            "Wed": ["17:00-19:00"],
            "Fri": ["17:00-19:00"],
            "Sat": ["09:00-11:00", "14:00-16:00"]
        },
        "reviews": [
            {"studentName": "Vũ Minh Khoa", "studentEmail": "khoa.vu@gmail.com", "rating": 5, "comment": "Cô dạy Hóa rất dễ hiểu, biết cách truyền cảm hứng học tập.", "date": "2024-10-20", "avatar": "https://i.pravatar.cc/150?img=22"}
        ],
        "completedLessons": 185,
        "studentCount": 28
    },
    {
        "id": 4,
        "name": "Lê Văn Hải",
        "email": "vanhai.le@educonnect.vn",
        "phone": "0987654324",
        "avatar": "https://i.pravatar.cc/150?img=61",
        "title": "Kỹ sư CNTT - ĐH FPT",
        "subjects": ["Tin học", "Lập trình"],
        "levels": ["THCS", "THPT", "Đại học"],
        "rating": 4.9,
        "reviewCount": 52,
        "pricePerHour": 300000,
        "district": "Cầu Giấy",
        "city": "Hà Nội",
        "teachingMode": "online",
        "verified": True,
        "status": "approved",
        "experience": 3,
        "bio": "Kỹ sư phần mềm 5 năm kinh nghiệm tại các công ty IT lớn. Dạy lập trình Python, Java, Web Development, Thuật toán và Cấu trúc dữ liệu.",
        "education": [
            {"degree": "Kỹ sư", "major": "Công nghệ Thông tin", "school": "ĐH FPT", "year": 2019}
        ],
        "certifications": ["AWS Certified", "Google Cloud Professional"],
        "schedule": {
            "Tue": ["20:00-22:00"],
            "Thu": ["20:00-22:00"],
            "Sat": ["09:00-11:00", "14:00-16:00"],
            "Sun": ["09:00-11:00"]
        },
        "reviews": [
            {"studentName": "Đinh Trọng Hiếu", "studentEmail": "hieu.dinh@gmail.com", "rating": 5, "comment": "Thầy dạy lập trình rất chắc chắn, từng bước rõ ràng. Tôi đã làm được project đầu tiên.", "date": "2024-11-10", "avatar": "https://i.pravatar.cc/150?img=11"}
        ],
        "completedLessons": 130,
        "studentCount": 22
    },
    {
        "id": 5,
        "name": "Đỗ Thị Lan Anh",
        "email": "lananh.do@educonnect.vn",
        "phone": "0987654325",
        "avatar": "https://i.pravatar.cc/150?img=44",
        "title": "Cử nhân Ngữ văn - ĐH Sư phạm HN",
        "subjects": ["Ngữ văn", "Lịch sử"],
        "levels": ["THCS", "THPT"],
        "rating": 4.6,
        "reviewCount": 89,
        "pricePerHour": 180000,
        "district": "Thanh Xuân",
        "city": "Hà Nội",
        "teachingMode": "both",
        "verified": False,
        "status": "approved",
        "experience": 4,
        "bio": "Giáo viên Ngữ văn với 4 năm kinh nghiệm. Chuyên luyện thi THPTQG môn Văn, ôn thi vào lớp 10. Phương pháp dạy học sáng tạo, gần gũi.",
        "education": [
            {"degree": "Cử nhân", "major": "Sư phạm Ngữ văn", "school": "ĐH Sư phạm HN", "year": 2020}
        ],
        "certifications": ["Chứng chỉ sư phạm"],
        "schedule": {
            "Mon": ["17:00-19:00"],
            "Wed": ["17:00-19:00"],
            "Sat": ["08:00-10:00", "14:00-16:00"],
            "Sun": ["08:00-10:00"]
        },
        "reviews": [
            {"studentName": "Phan Thị Mai", "studentEmail": "mai.phan@gmail.com", "rating": 5, "comment": "Cô dạy văn hay lắm, truyền cảm hứng cho học sinh. Con tôi giờ thích học Văn hơn rất nhiều.", "date": "2024-10-08", "avatar": "https://i.pravatar.cc/150?img=31"}
        ],
        "completedLessons": 220,
        "studentCount": 35
    },
    {
        "id": 6,
        "name": "Nguyễn Minh Khoa",
        "email": "minhkhoa.nguyen@educonnect.vn",
        "phone": "0987654326",
        "avatar": "https://i.pravatar.cc/150?img=70",
        "title": "Thạc sĩ Vật lý - ĐH KHTN HCM",
        "subjects": ["Vật lý", "Toán"],
        "levels": ["THPT", "Đại học"],
        "rating": 4.8,
        "reviewCount": 63,
        "pricePerHour": 280000,
        "district": "Quận 1",
        "city": "TP.HCM",
        "teachingMode": "both",
        "verified": True,
        "status": "approved",
        "experience": 7,
        "bio": "Thạc sĩ Vật lý lý thuyết, từng đoạt giải Nhất kỳ thi Olympic Vật lý toàn quốc. Chuyên luyện thi Olympic và THPTQG môn Lý, Toán.",
        "education": [
            {"degree": "Thạc sĩ", "major": "Vật lý lý thuyết", "school": "ĐH Khoa học Tự nhiên HCM", "year": 2019}
        ],
        "certifications": ["Giải nhất Olympic Vật lý quốc gia", "Chứng chỉ sư phạm"],
        "schedule": {
            "Mon": ["18:00-20:00"],
            "Wed": ["18:00-20:00"],
            "Fri": ["18:00-20:00"],
            "Sat": ["08:00-12:00"]
        },
        "reviews": [
            {"studentName": "Bùi Văn Long", "studentEmail": "long.bui@gmail.com", "rating": 5, "comment": "Thầy dạy siêu giỏi! Giải bài tập rất nhanh và dễ hiểu.", "date": "2024-09-15", "avatar": "https://i.pravatar.cc/150?img=55"}
        ],
        "completedLessons": 175,
        "studentCount": 30
    },
    {
        "id": 7,
        "name": "Trịnh Thị Bảo Châu",
        "email": "baochau.trinh@educonnect.vn",
        "phone": "0987654327",
        "avatar": "https://i.pravatar.cc/150?img=48",
        "title": "Cử nhân Địa lý - ĐH Sư phạm HCM",
        "subjects": ["Địa lý", "Lịch sử"],
        "levels": ["THCS", "THPT"],
        "rating": 4.5,
        "reviewCount": 41,
        "pricePerHour": 170000,
        "district": "Bình Thạnh",
        "city": "TP.HCM",
        "teachingMode": "online",
        "verified": False,
        "status": "approved",
        "experience": 2,
        "bio": "Gia sư Địa lý và Lịch sử với phương pháp dạy học hiện đại, tư duy phân tích. Hỗ trợ học sinh ôn thi vào lớp 10 và THPTQG.",
        "education": [
            {"degree": "Cử nhân", "major": "Sư phạm Địa lý", "school": "ĐH Sư phạm HCM", "year": 2022}
        ],
        "certifications": ["Chứng chỉ sư phạm"],
        "schedule": {
            "Tue": ["18:00-20:00"],
            "Thu": ["18:00-20:00"],
            "Sun": ["09:00-11:00", "14:00-16:00"]
        },
        "reviews": [],
        "completedLessons": 95,
        "studentCount": 15
    },
    {
        "id": 8,
        "name": "Hoàng Công Sơn",
        "email": "congson.hoang@educonnect.vn",
        "phone": "0987654328",
        "avatar": "https://i.pravatar.cc/150?img=65",
        "title": "Thạc sĩ Kinh tế - ĐH Kinh tế QD",
        "subjects": ["Kinh tế", "Tiếng Anh", "Toán"],
        "levels": ["THPT", "Đại học", "Người đi làm"],
        "rating": 4.7,
        "reviewCount": 58,
        "pricePerHour": 350000,
        "district": "Ba Đình",
        "city": "Hà Nội",
        "teachingMode": "online",
        "verified": True,
        "status": "approved",
        "experience": 5,
        "bio": "Thạc sĩ Kinh tế, làm việc tại ngân hàng đầu tư. Dạy Kinh tế vi/vĩ mô, Tài chính, Tiếng Anh thương mại, và ôn luyện CFA/ACCA.",
        "education": [
            {"degree": "Thạc sĩ", "major": "Tài chính - Ngân hàng", "school": "ĐH Kinh tế Quốc dân", "year": 2020}
        ],
        "certifications": ["CFA Level 2", "ACCA", "IELTS 7.5"],
        "schedule": {
            "Mon": ["20:00-22:00"],
            "Wed": ["20:00-22:00"],
            "Sat": ["09:00-11:00"],
            "Sun": ["15:00-17:00"]
        },
        "reviews": [
            {"studentName": "Tăng Minh Phúc", "studentEmail": "phuc.tang@gmail.com", "rating": 5, "comment": "Thầy dạy Kinh tế rất sâu sắc và thực tế. Giúp tôi hiểu được bản chất vấn đề.", "date": "2024-10-25", "avatar": "https://i.pravatar.cc/150?img=40"}
        ],
        "completedLessons": 145,
        "studentCount": 25
    }
]

def generate_slug(text: str) -> str:
    import re
    import unicodedata
    text = unicodedata.normalize('NFD', text).encode('ascii', 'ignore').decode('utf-8')
    text = re.sub(r'[^\w\s-]', '', text).strip().lower()
    return re.sub(r'[-\s]+', '-', text)

def seed():
    db = SessionLocal()
    try:
        print("[*] Seeding Database...")

        # 1. Seed Subjects
        subjects_map = {}
        for s in SUBJECTS_DATA:
            subject = db.query(Subject).filter(Subject.slug == s["slug"]).first()
            if not subject:
                subject = Subject(slug=s["slug"], name=s["name"], icon=s["icon"], color=s["color"])
                db.add(subject)
                db.flush()
            subjects_map[s["name"]] = subject

        # 2. Seed Levels
        levels_map = {}
        for l in LEVELS_DATA:
            level = db.query(Level).filter(Level.slug == l["slug"]).first()
            if not level:
                level = Level(slug=l["slug"], name=l["name"], grades=l["grades"])
                db.add(level)
                db.flush()
            levels_map[l["name"]] = level

        # 3. Seed Locations & Tutors
        for t in TUTORS_DATA:
            # Check or create Location
            loc_slug = f"{generate_slug(t['city'])}-{generate_slug(t['district'])}"
            location = db.query(Location).filter(Location.slug == loc_slug).first()
            if not location:
                location = Location(slug=loc_slug, city=t["city"], district=t["district"])
                db.add(location)
                db.flush()

            # Check or create User
            user = db.query(User).filter(User.email == t["email"]).first()
            if not user:
                user = User(
                    email=t["email"],
                    phone=t["phone"],
                    full_name=t["name"],
                    role="tutor",
                    avatar_url=t["avatar"]
                )
                db.add(user)
                db.flush()

            # Check or create TutorProfile
            tutor_profile = db.query(TutorProfile).filter(TutorProfile.user_id == user.id).first()
            if not tutor_profile:
                tutor_profile = TutorProfile(
                    user_id=user.id,
                    location_id=location.id,
                    title=t["title"],
                    bio=t["bio"],
                    experience_years=t["experience"],
                    price_per_hour=t["pricePerHour"],
                    teaching_mode=t["teachingMode"],
                    verified=t["verified"],
                    status=t["status"],
                    rating=t["rating"],
                    review_count=t["reviewCount"],
                    completed_lessons=t["completedLessons"],
                    student_count=t["studentCount"]
                )
                # Link subjects
                for s_name in t["subjects"]:
                    if s_name in subjects_map:
                        tutor_profile.subjects.append(subjects_map[s_name])

                # Link levels
                for l_name in t["levels"]:
                    if l_name in levels_map:
                        tutor_profile.levels.append(levels_map[l_name])

                db.add(tutor_profile)
                db.flush()

                # Educations
                for edu in t["education"]:
                    db.add(TutorEducation(
                        tutor_profile_id=tutor_profile.id,
                        degree=edu["degree"],
                        major=edu["major"],
                        school=edu["school"],
                        year=edu.get("year")
                    ))

                # Certifications
                for cert in t["certifications"]:
                    db.add(TutorCertificate(
                        tutor_profile_id=tutor_profile.id,
                        name=cert
                    ))

                # Availabilities
                for day, slots in t["schedule"].items():
                    for slot in slots:
                        try:
                            start_str, end_str = slot.split("-")
                            sh, sm = map(int, start_str.split(":"))
                            eh, em = map(int, end_str.split(":"))
                            db.add(TutorAvailability(
                                tutor_profile_id=tutor_profile.id,
                                day_of_week=day,
                                start_time=time(sh, sm),
                                end_time=time(eh, em)
                            ))
                        except Exception as e:
                            print(f"Error parsing slot {slot}: {e}")

                # Reviews
                for rev in t["reviews"]:
                    rev_date = datetime.strptime(rev["date"], "%Y-%m-%d") if "date" in rev else datetime.utcnow()
                    db.add(Review(
                        tutor_profile_id=tutor_profile.id,
                        rating=rev["rating"],
                        comment=rev["comment"],
                        created_at=rev_date
                    ))

        db.commit()
        print("[+] Seeding completed successfully!")
    except Exception as e:
        db.rollback()
        print(f"[-] Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed()
