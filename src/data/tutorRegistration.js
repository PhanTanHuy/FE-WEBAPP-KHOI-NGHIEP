export const tutorRegistrationSteps = [
    {
        number: 1,
        title: 'Thông tin cơ bản',
        description: 'Cung cấp thông tin cá nhân'
    },
    {
        number: 2,
        title: 'Trình độ học vấn',
        description: 'Bằng cấp, chứng chỉ, chuyên ngành'
    },
    {
        number: 3,
        title: 'Cài đặt giảng dạy',
        description: 'Môn học, cấp học, khu vực, học phí'
    },
    {
        number: 4,
        title: 'Hoàn tất',
        description: 'Xem lại và gửi duyệt'
    }
];

export const tutorRegistrationSubjects = [
    'Toán',
    'Vật lý',
    'Hóa học',
    'Sinh học',
    'Ngữ văn',
    'Tiếng Anh',
    'Tiếng Trung',
    'Tiếng Nhật',
    'IELTS',
    'Khác'
];

export const tutorRegistrationGrades = [
    'Tiểu học',
    'THCS',
    'THPT',
    'Luyện thi vào 10',
    'Luyện thi Đại học'
];

export const initialTutorRegistrationForm = {
    fullName: '',
    birthday: '',
    phone: '',
    email: '',
    address: '',
    introduction: '',
    avatar: null,
    educationLevel: '',
    major: '',
    certificates: [],
    certificateFile: null,
    subjects: [],
    grades: [],
    districts: ['', ''],
    minPrice: 100000,
    maxPrice: 500000
};
