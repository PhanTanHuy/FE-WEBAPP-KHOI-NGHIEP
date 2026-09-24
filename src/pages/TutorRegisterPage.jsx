import { useRef, useState } from 'react';
import {
    User,
    GraduationCap,
    Settings,
    CheckCircle2,
    Upload,
    Camera,
    Image as ImageIcon,
    ArrowLeft,
    ArrowRight,
    Save,
    MapPin,
    Phone,
    Mail,
    CalendarDays,
    FileText,
    Home,
    ChevronDown
} from 'lucide-react';

import './TutorRegisterPage.css';

const steps = [
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

const subjects = [
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

const grades = [
    'Tiểu học',
    'THCS',
    'THPT',
    'Luyện thi vào 10',
    'Luyện thi Đại học'
];

const initialForm = {
    // Step 1
    fullName: '',
    birthday: '',
    phone: '',
    email: '',
    address: '',
    introduction: '',
    avatar: null,

    // Step 2
    educationLevel: '',
    major: '',
    certificates: [],
    certificateFile: null,

    // Step 3
    subjects: [],
    grades: [],
    districts: ['', ''],
    minPrice: 100000,
    maxPrice: 500000
};

export default function TutorRegisterPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [form, setForm] = useState(initialForm);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    const avatarInputRef = useRef(null);
    const certificateInputRef = useRef(null);

    const progress = currentStep * 30;

    const updateForm = (field, value) => {
        setForm((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const toggleArrayValue = (field, value) => {
        setForm((prev) => {
            const current = prev[field];

            return {
                ...prev,
                [field]: current.includes(value)
                    ? current.filter((item) => item !== value)
                    : [...current, value]
            };
        });
    };

    const handleAvatarChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        updateForm('avatar', file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    const handleCertificateChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        updateForm('certificateFile', file);
    };

    const handleDistrictChange = (index, value) => {
        setForm((prev) => {
            const districts = [...prev.districts];
            districts[index] = value;

            return {
                ...prev,
                districts
            };
        });
    };

    const validateStep = () => {
        if (currentStep === 1) {
            if (!form.fullName.trim()) {
                alert('Vui lòng nhập họ và tên.');
                return false;
            }

            if (!form.birthday) {
                alert('Vui lòng chọn ngày sinh.');
                return false;
            }

            if (!form.phone.trim()) {
                alert('Vui lòng nhập số điện thoại.');
                return false;
            }

            if (!form.address.trim()) {
                alert('Vui lòng nhập địa chỉ hiện tại.');
                return false;
            }
        }

        if (currentStep === 2) {
            if (!form.educationLevel) {
                alert('Vui lòng chọn trình độ học vấn.');
                return false;
            }

            if (!form.major.trim()) {
                alert('Vui lòng nhập chuyên ngành.');
                return false;
            }
        }

        if (currentStep === 3) {
            if (form.subjects.length === 0) {
                alert('Vui lòng chọn ít nhất một môn học.');
                return false;
            }

            if (form.grades.length === 0) {
                alert('Vui lòng chọn ít nhất một cấp học.');
                return false;
            }

            if (!form.districts.some((district) => district)) {
                alert('Vui lòng chọn ít nhất một khu vực có thể di chuyển.');
                return false;
            }
        }

        return true;
    };

    const handleNext = () => {
        if (!validateStep()) return;

        if (currentStep < 3) {
            setCurrentStep((prev) => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setCurrentStep(4);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleSubmit = () => {
        setSubmitted(true);

        /*
         * Sau này khi có Backend:
         * await fetch('/api/tutors/register', {
         *   method: 'POST',
         *   body: ...
         * });
         */
    };

    const handleSaveDraft = () => {
        localStorage.setItem(
            'educonnect_tutor_register_draft',
            JSON.stringify({
                ...form,
                avatar: null,
                certificateFile: null
            })
        );

        alert('Đã lưu bản nháp.');
    };

    if (submitted) {
        return <CompletedPage />;
    }

    return (
        <main className="tutor-register-page">
            <div className="tutor-register-container">

                {/* SIDEBAR */}
                <aside className="tutor-register-sidebar">
                    <div className="register-sidebar-title">
                        Đăng ký & Tạo hồ sơ Gia sư
                    </div>

                    <div className="register-steps">
                        {steps.map((step) => {
                            const isActive = currentStep === step.number;
                            const isCompleted = currentStep > step.number;

                            return (
                                <div
                                    key={step.number}
                                    className={`register-step ${isActive ? 'active' : ''
                                        } ${isCompleted ? 'completed' : ''
                                        }`}
                                >
                                    <div className="register-step-number">
                                        {isCompleted ? (
                                            <CheckCircle2 size={18} />
                                        ) : (
                                            step.number
                                        )}
                                    </div>

                                    <div className="register-step-content">
                                        <div className="register-step-title">
                                            {step.title}
                                        </div>

                                        <div className="register-step-description">
                                            {step.description}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="register-sidebar-note">
                        <FileText size={24} />

                        <div>
                            <strong>Hồ sơ của bạn sẽ được kiểm duyệt</strong>

                            <p>
                                Sau khi gửi, hồ sơ sẽ được kiểm duyệt
                                trong vòng 1–3 ngày làm việc.
                            </p>
                        </div>
                    </div>

                    <div className="register-sidebar-illustration">
                        <div className="illustration-circle circle-1" />
                        <div className="illustration-circle circle-2" />

                        <div className="illustration-laptop">
                            💻
                        </div>

                        <div className="illustration-person">
                            👩🏻‍💻
                        </div>

                        <div className="illustration-graduation">
                            🎓
                        </div>
                    </div>
                </aside>

                {/* CONTENT */}
                <section className="tutor-register-content">

                    {/* TOP PROGRESS */}
                    <div className="register-topbar">
                        <div>
                            <span className="register-top-step">
                                Bước {currentStep} / 4
                            </span>

                            <span className="register-top-title">
                                {' '}
                                - {steps[currentStep - 1].title}
                            </span>
                        </div>

                        <div className="register-progress-wrapper">
                            <div className="register-progress">
                                <div
                                    className="register-progress-fill"
                                    style={{
                                        width: `${progress}%`
                                    }}
                                />
                            </div>

                            <strong>{progress}%</strong>
                        </div>
                    </div>

                    {/* STEP 1 */}
                    {currentStep === 1 && (
                        <StepOne
                            form={form}
                            updateForm={updateForm}
                            avatarPreview={avatarPreview}
                            avatarInputRef={avatarInputRef}
                            handleAvatarChange={handleAvatarChange}
                        />
                    )}

                    {/* STEP 2 */}
                    {currentStep === 2 && (
                        <StepTwo
                            form={form}
                            updateForm={updateForm}
                            toggleArrayValue={toggleArrayValue}
                            certificateInputRef={certificateInputRef}
                            handleCertificateChange={handleCertificateChange}
                        />
                    )}

                    {/* STEP 3 */}
                    {currentStep === 3 && (
                        <StepThree
                            form={form}
                            toggleArrayValue={toggleArrayValue}
                            handleDistrictChange={handleDistrictChange}
                            updateForm={updateForm}
                        />
                    )}

                    {/* STEP 4 */}
                    {currentStep === 4 && (
                        <StepFour form={form} />
                    )}

                    {/* FOOTER BUTTONS */}
                    <div className="register-actions">

                        {currentStep > 1 ? (
                            <button
                                type="button"
                                className="register-button secondary"
                                onClick={handleBack}
                            >
                                <ArrowLeft size={18} />
                                Quay lại
                            </button>
                        ) : (
                            <div />
                        )}

                        <div className="register-actions-right">

                            <button
                                type="button"
                                className="register-button draft"
                                onClick={handleSaveDraft}
                            >
                                <Save size={18} />
                                Lưu nháp
                            </button>

                            {currentStep < 4 ? (
                                <button
                                    type="button"
                                    className="register-button primary"
                                    onClick={handleNext}
                                >
                                    Tiếp theo
                                    <ArrowRight size={18} />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="register-button primary complete"
                                    onClick={handleSubmit}
                                >
                                    Hoàn thành
                                    <CheckCircle2 size={18} />
                                </button>
                            )}

                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}


/* =========================================================
   STEP 1
========================================================= */

function StepOne({
    form,
    updateForm,
    avatarPreview,
    avatarInputRef,
    handleAvatarChange
}) {
    return (
        <div className="register-step-page">

            <div className="register-heading">
                <h1>Thông tin cơ bản</h1>

                <p>
                    Vui lòng cung cấp đầy đủ thông tin cá nhân để hoàn tất
                    hồ sơ gia sư của bạn.
                </p>
            </div>

            <div className="register-form-card">

                <div className="register-basic-layout">

                    {/* AVATAR */}
                    <div className="avatar-section">

                        <div className="avatar-wrapper">
                            {avatarPreview ? (
                                <img
                                    src={avatarPreview}
                                    alt="Ảnh đại diện"
                                    className="avatar-preview"
                                />
                            ) : (
                                <div className="avatar-placeholder">
                                    <User size={55} />
                                </div>
                            )}

                            <button
                                type="button"
                                className="avatar-camera"
                                onClick={() =>
                                    avatarInputRef.current?.click()
                                }
                            >
                                <Camera size={16} />
                            </button>
                        </div>

                        <input
                            ref={avatarInputRef}
                            type="file"
                            accept="image/png,image/jpeg"
                            hidden
                            onChange={handleAvatarChange}
                        />

                        <button
                            type="button"
                            className="upload-avatar-button"
                            onClick={() =>
                                avatarInputRef.current?.click()
                            }
                        >
                            <Upload size={16} />
                            Tải ảnh lên
                        </button>

                        <span className="upload-hint">
                            Ảnh đại diện rõ mặt, định dạng JPG, PNG
                            <br />
                            (dung lượng tối đa 5MB)
                        </span>
                    </div>

                    {/* FORM */}
                    <div className="register-form-fields">

                        <div className="form-grid">

                            <FormField
                                label="Họ và tên"
                                required
                            >
                                <input
                                    type="text"
                                    placeholder="Nguyễn Thị Mai"
                                    value={form.fullName}
                                    onChange={(e) =>
                                        updateForm(
                                            'fullName',
                                            e.target.value
                                        )
                                    }
                                />
                            </FormField>

                            <FormField
                                label="Ngày sinh"
                                required
                            >
                                <div className="input-icon-wrapper">
                                    <input
                                        type="date"
                                        value={form.birthday}
                                        onChange={(e) =>
                                            updateForm(
                                                'birthday',
                                                e.target.value
                                            )
                                        }
                                    />
                                    <CalendarDays size={18} />
                                </div>
                            </FormField>

                            <FormField
                                label="Số điện thoại"
                                required
                            >
                                <div className="input-icon-wrapper">
                                    <input
                                        type="tel"
                                        placeholder="0987 654 321"
                                        value={form.phone}
                                        onChange={(e) =>
                                            updateForm(
                                                'phone',
                                                e.target.value
                                            )
                                        }
                                    />
                                    <Phone size={18} />
                                </div>
                            </FormField>

                            <FormField
                                label="Email"
                                optional
                            >
                                <div className="input-icon-wrapper">
                                    <input
                                        type="email"
                                        placeholder="example@email.com"
                                        value={form.email}
                                        onChange={(e) =>
                                            updateForm(
                                                'email',
                                                e.target.value
                                            )
                                        }
                                    />
                                    <Mail size={18} />
                                </div>
                            </FormField>

                        </div>

                        <FormField
                            label="Địa chỉ hiện tại"
                            required
                        >
                            <div className="input-icon-wrapper">
                                <input
                                    type="text"
                                    placeholder="123 Nguyễn Văn Cừ, Quận 1, TP.HCM"
                                    value={form.address}
                                    onChange={(e) =>
                                        updateForm(
                                            'address',
                                            e.target.value
                                        )
                                    }
                                />
                                <MapPin size={18} />
                            </div>
                        </FormField>

                        <FormField
                            label="Giới thiệu bản thân"
                            optional
                        >
                            <div className="textarea-wrapper">
                                <textarea
                                    maxLength={500}
                                    placeholder="Ví dụ: Tôi là sinh viên năm 3, chuyên ngành Sư phạm Toán, có kinh nghiệm gia sư 2 năm..."
                                    value={form.introduction}
                                    onChange={(e) =>
                                        updateForm(
                                            'introduction',
                                            e.target.value
                                        )
                                    }
                                />

                                <span>
                                    {form.introduction.length}/500
                                </span>
                            </div>
                        </FormField>

                    </div>
                </div>
            </div>
        </div>
    );
}


/* =========================================================
   STEP 2
========================================================= */

function StepTwo({
    form,
    updateForm,
    toggleArrayValue,
    certificateInputRef,
    handleCertificateChange
}) {
    return (
        <div className="register-step-page">

            <div className="register-heading">
                <h1>Trình độ học vấn</h1>

                <p>
                    Cung cấp thông tin về trình độ học vấn, chuyên ngành
                    và chứng chỉ của bạn.
                </p>
            </div>

            <div className="register-form-card">

                <div className="education-upload-grid">

                    <div>
                        <label className="form-label">
                            Ảnh thẻ sinh viên / Bằng cấp
                        </label>

                        <input
                            ref={certificateInputRef}
                            type="file"
                            hidden
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={handleCertificateChange}
                        />

                        <button
                            type="button"
                            className="certificate-upload"
                            onClick={() =>
                                certificateInputRef.current?.click()
                            }
                        >
                            <ImageIcon size={38} />

                            <strong>
                                {form.certificateFile
                                    ? form.certificateFile.name
                                    : 'Tải lên ảnh hoặc kéo thả'}
                            </strong>

                            <span>
                                Định dạng JPG, PNG, PDF
                                <br />
                                (tối đa 5MB)
                            </span>
                        </button>
                    </div>

                    <div>
                        <label className="form-label">
                            Chứng chỉ <span>(tùy chọn)</span>
                        </label>

                        <div className="certificate-list">

                            {[
                                'IELTS',
                                'Chứng chỉ sư phạm',
                                'Chứng chỉ tin học',
                                'Khác'
                            ].map((certificate) => (
                                <label
                                    className="checkbox-row"
                                    key={certificate}
                                >
                                    <input
                                        type="checkbox"
                                        checked={form.certificates.includes(
                                            certificate
                                        )}
                                        onChange={() =>
                                            toggleArrayValue(
                                                'certificates',
                                                certificate
                                            )
                                        }
                                    />

                                    <span className="custom-checkbox">
                                        {form.certificates.includes(
                                            certificate
                                        ) && '✓'}
                                    </span>

                                    {certificate}
                                </label>
                            ))}

                        </div>
                    </div>
                </div>

                <div className="form-grid education-grid">

                    <FormField label="Trình độ học vấn">
                        <div className="select-wrapper">
                            <select
                                value={form.educationLevel}
                                onChange={(e) =>
                                    updateForm(
                                        'educationLevel',
                                        e.target.value
                                    )
                                }
                            >
                                <option value="">
                                    Chọn trình độ
                                </option>
                                <option value="THPT">
                                    THPT
                                </option>
                                <option value="Cao đẳng">
                                    Cao đẳng
                                </option>
                                <option value="Đại học">
                                    Đại học
                                </option>
                                <option value="Sau đại học">
                                    Sau đại học
                                </option>
                            </select>

                            <ChevronDown size={18} />
                        </div>
                    </FormField>

                    <FormField
                        label="Chuyên ngành"
                        required
                    >
                        <input
                            type="text"
                            placeholder="Sư phạm Tiếng Anh"
                            value={form.major}
                            onChange={(e) =>
                                updateForm(
                                    'major',
                                    e.target.value
                                )
                            }
                        />
                    </FormField>

                </div>
            </div>
        </div>
    );
}


/* =========================================================
   STEP 3
========================================================= */

function StepThree({
    form,
    toggleArrayValue,
    handleDistrictChange,
    updateForm
}) {
    return (
        <div className="register-step-page">

            <div className="register-heading">
                <h1>Cài đặt giảng dạy</h1>

                <p>
                    Chọn môn học, cấp học, khu vực và mức học phí
                    bạn mong muốn.
                </p>
            </div>

            <div className="register-form-card">

                {/* SUBJECTS */}
                <div className="setting-section">

                    <label className="form-label">
                        Môn học có thể dạy
                        <span className="required-star">*</span>
                    </label>

                    <div className="subject-grid">

                        {subjects.map((subject) => (
                            <label
                                className="checkbox-subject"
                                key={subject}
                            >
                                <input
                                    type="checkbox"
                                    checked={form.subjects.includes(
                                        subject
                                    )}
                                    onChange={() =>
                                        toggleArrayValue(
                                            'subjects',
                                            subject
                                        )
                                    }
                                />

                                <span className="custom-checkbox">
                                    {form.subjects.includes(
                                        subject
                                    ) && '✓'}
                                </span>

                                {subject}
                            </label>
                        ))}

                    </div>
                </div>

                {/* GRADES */}
                <div className="setting-section">

                    <label className="form-label">
                        Cấp học có thể dạy
                        <span className="required-star">*</span>
                    </label>

                    <div className="grade-options">

                        {grades.map((grade) => (
                            <button
                                type="button"
                                key={grade}
                                className={`grade-chip ${form.grades.includes(grade)
                                        ? 'selected'
                                        : ''
                                    }`}
                                onClick={() =>
                                    toggleArrayValue(
                                        'grades',
                                        grade
                                    )
                                }
                            >
                                {grade}
                            </button>
                        ))}

                    </div>
                </div>

                {/* DISTRICTS */}
                <div className="setting-section">

                    <label className="form-label">
                        Khu vực có thể di chuyển
                        <span className="info-icon">i</span>
                    </label>

                    <div className="district-grid">

                        {[0, 1].map((index) => (
                            <div
                                className="select-wrapper"
                                key={index}
                            >
                                <select
                                    value={
                                        form.districts[index]
                                    }
                                    onChange={(e) =>
                                        handleDistrictChange(
                                            index,
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="">
                                        Chọn quận
                                    </option>

                                    <option value="Quận 1">
                                        Quận 1
                                    </option>

                                    <option value="Quận 3">
                                        Quận 3
                                    </option>

                                    <option value="Quận 5">
                                        Quận 5
                                    </option>

                                    <option value="Quận 10">
                                        Quận 10
                                    </option>

                                    <option value="Quận Bình Thạnh">
                                        Quận Bình Thạnh
                                    </option>

                                    <option value="Quận Phú Nhuận">
                                        Quận Phú Nhuận
                                    </option>

                                    <option value="TP. Thủ Đức">
                                        TP. Thủ Đức
                                    </option>
                                </select>

                                <ChevronDown size={18} />
                            </div>
                        ))}

                    </div>
                </div>

                {/* PRICE */}
                <div className="setting-section">

                    <div className="price-header">
                        <label className="form-label">
                            Mức học phí mong muốn (VNĐ/giờ)
                            <span className="required-star">*</span>
                        </label>

                        <strong>
                            {form.minPrice.toLocaleString('vi-VN')}
                            {' – '}
                            {form.maxPrice.toLocaleString('vi-VN')}
                            ₫
                        </strong>
                    </div>

                    <div className="price-slider">

                        <input
                            type="range"
                            min="100000"
                            max="500000"
                            step="10000"
                            value={form.minPrice}
                            onChange={(e) => {
                                const value =
                                    Number(e.target.value);

                                if (value < form.maxPrice) {
                                    updateForm(
                                        'minPrice',
                                        value
                                    );
                                }
                            }}
                        />

                        <input
                            type="range"
                            min="100000"
                            max="500000"
                            step="10000"
                            value={form.maxPrice}
                            onChange={(e) => {
                                const value =
                                    Number(e.target.value);

                                if (value > form.minPrice) {
                                    updateForm(
                                        'maxPrice',
                                        value
                                    );
                                }
                            }}
                        />

                    </div>

                    <div className="price-labels">
                        <span>100.000₫</span>
                        <span>500.000₫</span>
                    </div>

                </div>

            </div>
        </div>
    );
}


/* =========================================================
   STEP 4
========================================================= */

function StepFour({ form }) {
    return (
        <div className="register-step-page">

            <div className="register-heading">
                <h1>Kiểm tra hồ sơ</h1>

                <p>
                    Vui lòng kiểm tra lại thông tin trước khi gửi hồ sơ
                    cho EduConnect.
                </p>
            </div>

            <div className="review-card">

                <div className="review-section">
                    <div className="review-section-header">
                        <User size={20} />
                        <h3>Thông tin cơ bản</h3>
                    </div>

                    <div className="review-grid">
                        <ReviewItem
                            label="Họ và tên"
                            value={form.fullName || 'Chưa nhập'}
                        />

                        <ReviewItem
                            label="Ngày sinh"
                            value={form.birthday || 'Chưa nhập'}
                        />

                        <ReviewItem
                            label="Số điện thoại"
                            value={form.phone || 'Chưa nhập'}
                        />

                        <ReviewItem
                            label="Email"
                            value={form.email || 'Chưa nhập'}
                        />

                        <ReviewItem
                            label="Địa chỉ"
                            value={form.address || 'Chưa nhập'}
                        />
                    </div>
                </div>

                <div className="review-divider" />

                <div className="review-section">
                    <div className="review-section-header">
                        <GraduationCap size={20} />
                        <h3>Trình độ học vấn</h3>
                    </div>

                    <div className="review-grid">
                        <ReviewItem
                            label="Trình độ"
                            value={
                                form.educationLevel ||
                                'Chưa nhập'
                            }
                        />

                        <ReviewItem
                            label="Chuyên ngành"
                            value={
                                form.major || 'Chưa nhập'
                            }
                        />

                        <ReviewItem
                            label="Chứng chỉ"
                            value={
                                form.certificates.length
                                    ? form.certificates.join(', ')
                                    : 'Không có'
                            }
                        />
                    </div>
                </div>

                <div className="review-divider" />

                <div className="review-section">
                    <div className="review-section-header">
                        <Settings size={20} />
                        <h3>Cài đặt giảng dạy</h3>
                    </div>

                    <div className="review-item-full">
                        <span>Môn học</span>

                        <div className="review-tags">
                            {form.subjects.length > 0 ? (
                                form.subjects.map((subject) => (
                                    <span key={subject}>
                                        {subject}
                                    </span>
                                ))
                            ) : (
                                <em>Chưa chọn</em>
                            )}
                        </div>
                    </div>

                    <div className="review-item-full">
                        <span>Cấp học</span>

                        <div className="review-tags">
                            {form.grades.length > 0 ? (
                                form.grades.map((grade) => (
                                    <span key={grade}>
                                        {grade}
                                    </span>
                                ))
                            ) : (
                                <em>Chưa chọn</em>
                            )}
                        </div>
                    </div>

                    <div className="review-grid">
                        <ReviewItem
                            label="Khu vực"
                            value={
                                form.districts
                                    .filter(Boolean)
                                    .join(', ') ||
                                'Chưa chọn'
                            }
                        />

                        <ReviewItem
                            label="Học phí"
                            value={`${form.minPrice.toLocaleString(
                                'vi-VN'
                            )}₫ – ${form.maxPrice.toLocaleString(
                                'vi-VN'
                            )}₫ / giờ`}
                        />
                    </div>
                </div>

                <div className="review-warning">
                    <CheckCircle2 size={20} />

                    <p>
                        Sau khi gửi, hồ sơ của bạn sẽ được EduConnect
                        kiểm duyệt trong vòng <strong>1–3 ngày làm việc</strong>.
                        Bạn sẽ nhận được thông báo khi hồ sơ được duyệt.
                    </p>
                </div>

            </div>
        </div>
    );
}


/* =========================================================
   COMPLETE PAGE
========================================================= */

function CompletedPage() {
    return (
        <main className="tutor-register-page completed-page">

            <div className="completed-card">

                <div className="completed-icon">
                    <CheckCircle2 size={58} />
                </div>

                <div className="completed-confetti">
                    ✦　✦　✦
                </div>

                <h1>Hoàn thành!</h1>

                <p>
                    Hồ sơ của bạn đã được gửi đi.
                    <br />
                    Chúng tôi sẽ tiến hành kiểm duyệt trong vòng 1–3 ngày.
                </p>

                <a
                    href="/"
                    className="completed-home-button"
                >
                    Về trang chủ
                </a>

                <a
                    href="/tien-do"
                    className="completed-status-link"
                >
                    Xem trạng thái hồ sơ →
                </a>

                <div className="completed-illustration">
                    <div>👩🏻‍💻</div>
                    <span>🎓</span>
                    <span>📄</span>
                </div>

            </div>

        </main>
    );
}


/* =========================================================
   COMPONENTS
========================================================= */

function FormField({
    label,
    required,
    optional,
    children
}) {
    return (
        <div className="form-field">

            <label className="form-label">
                {label}

                {required && (
                    <span className="required-star">*</span>
                )}

                {optional && (
                    <span className="optional-text">
                        {' '}
                        (không bắt buộc)
                    </span>
                )}
            </label>

            {children}
        </div>
    );
}

function ReviewItem({ label, value }) {
    return (
        <div className="review-item">
            <span>{label}</span>
            <strong>{value}</strong>
        </div>
    );
}