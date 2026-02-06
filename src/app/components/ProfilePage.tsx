import React from "react";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  GraduationCap, 
  Briefcase, 
  Award, 
  Code2, 
  ArrowLeft 
} from "lucide-react";

// Menggunakan path lokal yang sudah Anda konfirmasi ada di folder assets
import userPortrait from "../../assets/bdf3cd406212a8881b29220053c03e271bedd103.png";

export const ProfilePage = ({ onBack }: { onBack: () => void }) => {
  const personalInfo = [
    { icon: <Mail size={18} />, label: "Email", value: "ultazanagan111@gmail.com" },
    { icon: <Phone size={18} />, label: "Telepon", value: "082211464363" },
    { icon: <Linkedin size={18} />, label: "LinkedIn", value: "linkedin.com/in/ul-tazasyah-274a2a392" },
    { icon: <MapPin size={18} />, label: "Domisili", value: "Latong, Nagan Raya, Aceh" },
  ];

  const education = [
    {
      school: "Universitas Teuku Umar",
      degree: "S1 Teknologi Informasi (IPK: 3.29/4.00)",
      period: "2021 - 2025",
      details: "Fokus pada Analisis Sistem, Pemrograman Berorientasi Objek, dan Keamanan Jaringan."
    },
    {
      school: "SMA Negeri 3 Seunagan",
      degree: "Ilmu Pengetahuan Sosial",
      period: "2018 - 2021",
      details: "Peringkat 1 (Kelas 11-12) dan menjabat sebagai Ketua OSIS."
    }
  ];

  const experience = [
    {
      role: "Kerja Praktek (IT Support & TIK)",
      company: "Diskominsa Aceh Barat",
      period: "Des 2024 - Jan 2025",
      description: "Berkontribusi dalam bidang Teknologi Informasi dan Komunikasi serta penambahan fitur berita pada website resmi."
    },
    {
      role: "Manager GIS dan Data",
      company: "Yayasan APEL Green Aceh",
      period: "Des 2022 - Nov 2024",
      description: "Mengelola data geospasial dan informasi lingkungan untuk pemantauan kawasan lindung."
    },
    {
      role: "Enumerator Proklim",
      company: "DLHK / KLHK",
      period: "Feb 2024 - Apr 2024",
      description: "Melakukan pendataan untuk Program Kampung Iklim."
    }
  ];

  const skills = {
    languages: ["HTML", "CSS", "PHP", "JavaScript", "Kotlin", "Python", "C++"],
    frameworks: ["Laravel", "CodeIgniter (CI3/CI4)", "React"],
    tools: ["ArcMap", "Google Earth", "VS Code", "MySQL", "Android Studio", "Cisco", "Burp Suite"]
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white p-4 md:p-8 font-sans">
      {/* Header & Back Button */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-[#00F5A0] transition-colors mb-8"
      >
        <ArrowLeft size={20} /> Kembali ke Portofolio
      </button>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-[#161B2D] rounded-2xl p-6 border border-gray-800 sticky top-8">
            <div className="relative w-48 h-48 mx-auto mb-6">
              <div className="absolute inset-0 bg-[#00F5A0] rounded-full blur-2xl opacity-20 animate-pulse"></div>
              <img 
                src={userPortrait} 
                alt="Ul Tazasyah" 
                className="relative w-full h-full object-cover object-top rounded-full border-2 border-[#00F5A0]"
              />
            </div>
            
            <h1 className="text-2xl font-bold text-center mb-2">Ul Tazasyah</h1>
            <p className="text-[#00F5A0] text-center mb-6 font-medium">Fullstack Developer & GIS Specialist</p>
            
            <div className="space-y-4">
              {personalInfo.map((info, index) => (
                <div key={index} className="flex items-center gap-3 text-gray-300 text-sm">
                  <span className="text-[#00F5A0]">{info.icon}</span>
                  <div>
                    <p className="text-gray-500 text-xs uppercase">{info.label}</p>
                    <p>{info.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Summary */}
          <section className="bg-[#161B2D] rounded-2xl p-6 border border-gray-800">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Award className="text-[#00F5A0]" size={22} /> Profil Profesional
            </h2>
            <p className="text-gray-400 leading-relaxed text-sm md:text-base">
              Lulusan S1 Teknologi Informasi dari Universitas Teuku Umar dengan IPK 3.29[cite: 3, 12, 14]. Memiliki pengalaman kuat di bidang TIK melalui kerja praktek di Diskominsa Aceh Barat serta keahlian khusus dalam pengelolaan data GIS[cite: 4, 5, 23, 25]. Berdedikasi tinggi, proaktif, dan siap memberikan kontribusi positif dalam pengembangan perangkat lunak maupun dukungan IT[cite: 6].
            </p>
          </section>

          {/* Education */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <GraduationCap className="text-[#00F5A0]" size={22} /> Pendidikan
            </h2>
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div key={index} className="bg-[#161B2D] p-5 rounded-xl border border-gray-800 hover:border-[#00F5A0]/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-[#00F5A0]">{edu.school}</h3>
                    <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-400">{edu.period}</span>
                  </div>
                  <p className="text-sm font-medium mb-1">{edu.degree}</p>
                  <p className="text-xs text-gray-500">{edu.details}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Experience */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Briefcase className="text-[#00F5A0]" size={22} /> Pengalaman Kerja
            </h2>
            <div className="space-y-4">
              {experience.map((exp, index) => (
                <div key={index} className="bg-[#161B2D] p-5 rounded-xl border border-gray-800">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold">{exp.role}</h3>
                    <span className="text-xs text-[#00F5A0]">{exp.period}</span>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">{exp.company}</p>
                  <p className="text-xs text-gray-500">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Skills Grid */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Code2 className="text-[#00F5A0]" size={22} /> Keahlian Teknis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#161B2D] p-4 rounded-xl border border-gray-800">
                <h3 className="text-xs uppercase text-gray-500 mb-3">Programming & Frameworks</h3>
                <div className="flex flex-wrap gap-2">
                  {[...skills.languages, ...skills.frameworks].map((s, i) => (
                    <span key={i} className="px-3 py-1 bg-[#0A0F1C] border border-gray-700 rounded-full text-xs text-[#00F5A0]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-[#161B2D] p-4 rounded-xl border border-gray-800">
                <h3 className="text-xs uppercase text-gray-500 mb-3">Software & Tools</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.tools.map((s, i) => (
                    <span key={i} className="px-3 py-1 bg-[#0A0F1C] border border-gray-700 rounded-full text-xs text-gray-300">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};