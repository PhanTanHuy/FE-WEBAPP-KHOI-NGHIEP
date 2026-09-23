export const bookings = [
  {
    id: "BK001",
    tutorId: 1,
    tutorName: "Nguyễn Thị Minh Anh",
    tutorAvatar: "https://i.pravatar.cc/150?img=47",
    studentName: "Lê Văn Bình",
    parentName: "Lê Văn Hùng",
    subject: "Toán",
    level: "THPT",
    date: "2024-11-20",
    startTime: "18:00",
    endTime: "20:00",
    mode: "online",
    status: "confirmed",
    price: 500000,
    note: "Ôn tập chương Giải tích"
  },
  {
    id: "BK002",
    tutorId: 2,
    tutorName: "Trần Đức Mạnh",
    tutorAvatar: "https://i.pravatar.cc/150?img=68",
    studentName: "Lê Văn Bình",
    parentName: "Lê Văn Hùng",
    subject: "Tiếng Anh",
    level: "THPT",
    date: "2024-11-21",
    startTime: "19:00",
    endTime: "21:00",
    mode: "online",
    status: "pending",
    price: 400000,
    note: "Luyện Speaking IELTS"
  },
  {
    id: "BK003",
    tutorId: 3,
    tutorName: "Phạm Thị Thu Hương",
    tutorAvatar: "https://i.pravatar.cc/150?img=56",
    studentName: "Lê Văn Bình",
    parentName: "Lê Văn Hùng",
    subject: "Hóa học",
    level: "THPT",
    date: "2024-11-15",
    startTime: "17:00",
    endTime: "19:00",
    mode: "offline",
    status: "completed",
    price: 460000,
    note: "Hóa hữu cơ"
  },
  {
    id: "BK004",
    tutorId: 1,
    tutorName: "Nguyễn Thị Minh Anh",
    tutorAvatar: "https://i.pravatar.cc/150?img=47",
    studentName: "Lê Văn Bình",
    parentName: "Lê Văn Hùng",
    subject: "Toán",
    level: "THPT",
    date: "2024-11-10",
    startTime: "18:00",
    endTime: "20:00",
    mode: "online",
    status: "completed",
    price: 500000,
    note: "Số phức"
  }
];

export const progressData = [
  { month: "T6", toan: 6.5, anh: 5.8, hoa: 6.0, ly: 5.5 },
  { month: "T7", toan: 7.0, anh: 6.2, hoa: 6.5, ly: 6.0 },
  { month: "T8", toan: 7.5, anh: 6.8, hoa: 7.0, ly: 6.5 },
  { month: "T9", toan: 7.8, anh: 7.2, hoa: 7.5, ly: 7.0 },
  { month: "T10", toan: 8.2, anh: 7.8, hoa: 8.0, ly: 7.5 },
  { month: "T11", toan: 8.5, anh: 8.2, hoa: 8.3, ly: 8.0 }
];

export const currentUser = {
  id: "U001",
  name: "Lê Văn Hùng",
  email: "levanhung@email.com",
  phone: "0912345678",
  role: "parent",
  avatar: "https://i.pravatar.cc/150?img=50",
  student: {
    name: "Lê Văn Bình",
    grade: "Lớp 11",
    school: "THPT Chu Văn An",
    age: 17
  }
};
