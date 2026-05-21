import { useState } from 'react';
import { useNavigate } from 'react-router';
import { User, Building2, CreditCard, Mail, Lock } from 'lucide-react';
import logo from '../../imports/ChatGPT_Image_10_47_26_20_thg_5__2026-removebg-preview.png';
import { registerUser } from '../../firebase/authService';

export function RegisterPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [school, setSchool] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (rawFullName: string, rawSchool: string, rawStudentId: string, rawEmail: string, rawPassword: string) => {
    if (!rawFullName.trim()) return 'Vui lòng nhập họ và tên.';
    if (!rawSchool.trim()) return 'Vui lòng nhập trường.';
    if (!rawStudentId.trim()) return 'Vui lòng nhập mã sinh viên.';

    const normalizedEmail = rawEmail.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
    if (!emailOk) return 'Email không hợp lệ.';
    if (rawPassword.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const normalizedEmail = email.trim();
    const validationError = validate(fullName, school, studentId, normalizedEmail, password);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsSubmitting(true);
      await registerUser(
        normalizedEmail,
        password,
        {
          fullName: fullName.trim(),
          school: school.trim(),
          studentId: studentId.trim(),
        },
        'user'
      );

      setSuccess('Đăng ký thành công. Bạn có thể đăng nhập ngay bây giờ.');
      setPassword('');
      navigate('/login');
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      console.error('Sign up failed:', err);
      if (code === 'auth/email-already-in-use') {
        setError('Email này đã được sử dụng.');
      } else if (code === 'auth/invalid-email') {
        setError('Email không hợp lệ.');
      } else if (code === 'auth/weak-password') {
        setError('Mật khẩu quá yếu. Hãy dùng ít nhất 6 ký tự.');
      } else if (code === 'auth/operation-not-allowed') {
        setError('Email/Password chưa được bật trong Firebase Authentication.');
      } else if (code === 'auth/network-request-failed') {
        setError('Lỗi mạng khi đăng ký. Hãy kiểm tra internet và thử lại.');
      } else if (code === 'permission-denied') {
        setError('Không có quyền lưu hồ sơ (permission-denied). Hãy kiểm tra Cloud Firestore Rules.');
      } else {
        setError(`Đăng ký thất bại (${code ?? 'unknown'}). Vui lòng thử lại.`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <img src={logo} alt="LiemResearch" className="h-24 w-auto" />
          </div>
          <h1 className="text-foreground mb-2">Create Account</h1>
          <p className="text-muted-foreground">Register for LiemResearch</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-border p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-foreground mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"
                  placeholder="Nguyễn Văn A"
                  required
                  autoComplete="name"
                />
              </div>
            </div>

            <div>
              <label className="block text-foreground mb-2">School</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type="text"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"
                  placeholder="Trường Đại học Công Nghệ"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-foreground mb-2">Student ID</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"
                  placeholder="SV001"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-foreground mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"
                  placeholder="student@university.edu"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="block text-foreground mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"
                  placeholder="Create a strong password"
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            {error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : null}
            {success ? (
              <p className="text-sm text-foreground">{success}</p>
            ) : null}

            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-60"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering…' : 'Register'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-primary hover:underline"
              >
                Login here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
