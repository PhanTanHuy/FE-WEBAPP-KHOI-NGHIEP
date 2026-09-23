export const subjects = [
  { id: "toan", name: "Toán", icon: "📐", color: "#3B82F6" },
  { id: "van", name: "Ngữ văn", icon: "📖", color: "#8B5CF6" },
  { id: "anh", name: "Tiếng Anh", icon: "🌍", color: "#10B981" },
  { id: "ly", name: "Vật lý", icon: "⚡", color: "#F59E0B" },
  { id: "hoa", name: "Hóa học", icon: "🧪", color: "#EF4444" },
  { id: "sinh", name: "Sinh học", icon: "🌿", color: "#059669" },
  { id: "su", name: "Lịch sử", icon: "🏛️", color: "#92400E" },
  { id: "dia", name: "Địa lý", icon: "🗺️", color: "#0284C7" },
  { id: "tin", name: "Tin học", icon: "💻", color: "#6366F1" },
  { id: "lap-trinh", name: "Lập trình", icon: "🖥️", color: "#7C3AED" },
  { id: "kinh-te", name: "Kinh tế", icon: "📊", color: "#D97706" },
  { id: "am-nhac", name: "Âm nhạc", icon: "🎵", color: "#EC4899" }
];

export const levels = [
  { id: "tieu-hoc", name: "Tiểu học", grades: "Lớp 1-5" },
  { id: "thcs", name: "THCS", grades: "Lớp 6-9" },
  { id: "thpt", name: "THPT", grades: "Lớp 10-12" },
  { id: "dai-hoc", name: "Đại học", grades: "Năm 1-4" },
  { id: "nguoi-di-lam", name: "Người đi làm", grades: "Mọi độ tuổi" }
];

export const cities = [
  { id: "ha-noi", name: "Hà Nội" },
  { id: "tp-hcm", name: "TP.HCM" },
  { id: "da-nang", name: "Đà Nẵng" },
  { id: "can-tho", name: "Cần Thơ" },
  { id: "hai-phong", name: "Hải Phòng" }
];

export const priceRanges = [
  { id: "under-150", name: "Dưới 150.000đ/giờ", min: 0, max: 150000 },
  { id: "150-250", name: "150.000 - 250.000đ/giờ", min: 150000, max: 250000 },
  { id: "250-400", name: "250.000 - 400.000đ/giờ", min: 250000, max: 400000 },
  { id: "over-400", name: "Trên 400.000đ/giờ", min: 400000, max: Infinity }
];
