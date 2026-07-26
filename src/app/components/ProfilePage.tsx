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
  ArrowLeft,
  Download,
} from "lucide-react";
import userPortrait from "../../assets/bdf3cd406212a8881b29220053c03e271bedd103.png";

export const ProfilePage = ({ onBack }: { onBack: () => void }) => {
  const handleDownloadCV = () => {
    const link = document.createElement("a");
    link.href = "/certificates/CV-UL TAZASYAH.pdf";
    link.download = "CV-UL TAZASYAH.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
      details: "Fokus pada Analisis Sistem, Pemrograman Berorientasi Objek, dan Keamanan Jaringan.",
    },
    {
      school: "SMA Negeri 3 Seunagan",
      degree: "Ilmu Pengetahuan Sosial",
      period: "2018 - 2021",
      details: "Peringkat 1 (Kelas 11-12) dan menjabat sebagai Ketua OSIS.",
    },
  ];

  const experience = [
    {
      role: "Kerja Praktek (IT Support & TIK)",
      company: "Diskominsa Aceh Barat",
      period: "Des 2024 - Jan 2025",
      description: "Berkontribusi dalam bidang Teknologi Informasi dan Komunikasi serta penambahan fitur berita pada website resmi.",
    },
    {
      role: "Manager GIS dan Data",
      company: "Yayasan APEL Green Aceh",
      period: "Des 2022 - Nov 2024",
      description: "Mengelola data geospasial dan informasi lingkungan untuk pemantauan kawasan lindung.",
    },
    {
      role: "Enumerator Proklim",
      company: "DLHK / KLHK",
      period: "Feb 2024 - Apr 2024",
      description: "Melakukan pendataan untuk Program Kampung Iklim.",
    },
  ];

  const skills = {
    languages: ["HTML", "CSS", "PHP", "JavaScript", "Kotlin", "Python", "C++"],
    frameworks: ["Laravel", "CodeIgniter (CI3/CI4)", "React"],
    tools: ["ArcMap", "Google Earth", "VS Code", "MySQL", "Android Studio", "Cisco", "Burp Suite"],
  };

  return (
    <div
      className="min-h-screen p-4 md:p-8 font-sans"
      style={{ background: "var(--t-bg)", color: "var(--t-text)" }}
    >
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-medium mb-8 transition-colors"
        style={{ color: "var(--t-text-muted)" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--t-accent)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--t-text-muted)")}
      >
        <ArrowLeft size={20} /> Kembali ke Portofolio
      </button>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── Left: Profile Card ── */}
        <div className="lg:col-span-1">
          <div
            className="rounded-2xl p-6 border sticky top-8"
            style={{ background: "var(--t-bg-card)", borderColor: "var(--t-border)" }}
          >
            {/* Avatar */}
            <div className="relative w-48 h-48 mx-auto mb-6">
              <div
                className="absolute inset-0 rounded-full blur-2xl opacity-20 animate-pulse"
                style={{ background: "var(--t-accent)" }}
              />
              <img
                src={userPortrait}
                alt="Ul Tazasyah"
                className="relative w-full h-full object-cover object-top rounded-full border-2"
                style={{ borderColor: "var(--t-accent)" }}
              />
            </div>

            <h1 className="text-2xl font-bold text-center mb-1" style={{ color: "var(--t-text)" }}>
              Ul Tazasyah
            </h1>
            <p className="text-center mb-6 font-medium text-sm" style={{ color: "var(--t-accent)" }}>
              Fullstack Developer & GIS Specialist
            </p>

            {/* Contact info */}
            <div className="space-y-4">
              {personalInfo.map((info, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <span style={{ color: "var(--t-accent)" }}>{info.icon}</span>
                  <div>
                    <p className="text-[10px] uppercase font-bold" style={{ color: "var(--t-text-sub)" }}>
                      {info.label}
                    </p>
                    <p style={{ color: "var(--t-text-muted)" }}>{info.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Download CV */}
            <div className="mt-6 pt-6 border-t" style={{ borderColor: "var(--t-border)" }}>
              <button
                onClick={handleDownloadCV}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg font-semibold transition-all group"
                style={{ background: "var(--t-accent)", color: "var(--t-bg)" }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                <Download size={18} className="group-hover:scale-110 transition-transform" />
                Download CV
              </button>
            </div>
          </div>
        </div>

        {/* ── Right: Details ── */}
        <div className="lg:col-span-2 space-y-8">

          {/* Professional Summary */}
          <section
            className="rounded-2xl p-6 border"
            style={{ background: "var(--t-bg-card)", borderColor: "var(--t-border)" }}
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--t-text)" }}>
              <Award style={{ color: "var(--t-accent)" }} size={22} /> Profil Profesional
            </h2>
            <p className="leading-relaxed text-sm md:text-base" style={{ color: "var(--t-text-muted)" }}>
              Lulusan S1 Teknologi Informasi dari Universitas Teuku Umar dengan IPK 3.29. Memiliki
              pengalaman kuat di bidang TIK melalui kerja praktek di Diskominsa Aceh Barat serta keahlian
              khusus dalam pengelolaan data GIS. Berdedikasi tinggi, proaktif, dan siap memberikan
              kontribusi positif dalam pengembangan perangkat lunak maupun dukungan IT.
            </p>
          </section>

          {/* Education */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--t-text)" }}>
              <GraduationCap style={{ color: "var(--t-accent)" }} size={22} /> Pendidikan
            </h2>
            <div className="space-y-4">
              {education.map((edu, i) => (
                <div
                  key={i}
                  className="p-5 rounded-xl border transition-all"
                  style={{ background: "var(--t-bg-card)", borderColor: "var(--t-border)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = "color-mix(in srgb, var(--t-accent) 40%, transparent)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = "var(--t-border)")
                  }
                >
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <h3 className="font-bold" style={{ color: "var(--t-accent)" }}>{edu.school}</h3>
                    <span
                      className="text-xs px-2 py-1 rounded flex-shrink-0"
                      style={{ background: "var(--t-bg)", color: "var(--t-text-muted)", border: "1px solid var(--t-border)" }}
                    >
                      {edu.period}
                    </span>
                  </div>
                  <p className="text-sm font-medium mb-1" style={{ color: "var(--t-text)" }}>{edu.degree}</p>
                  <p className="text-xs" style={{ color: "var(--t-text-sub)" }}>{edu.details}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Experience */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--t-text)" }}>
              <Briefcase style={{ color: "var(--t-accent)" }} size={22} /> Pengalaman Kerja
            </h2>
            <div className="space-y-4">
              {experience.map((exp, i) => (
                <div
                  key={i}
                  className="p-5 rounded-xl border"
                  style={{ background: "var(--t-bg-card)", borderColor: "var(--t-border)" }}
                >
                  <div className="flex justify-between items-start mb-1 gap-2">
                    <h3 className="font-bold" style={{ color: "var(--t-text)" }}>{exp.role}</h3>
                    <span className="text-xs flex-shrink-0" style={{ color: "var(--t-accent2)" }}>{exp.period}</span>
                  </div>
                  <p className="text-sm font-medium mb-2" style={{ color: "var(--t-accent)" }}>{exp.company}</p>
                  <p className="text-xs" style={{ color: "var(--t-text-sub)" }}>{exp.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Skills */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--t-text)" }}>
              <Code2 style={{ color: "var(--t-accent)" }} size={22} /> Keahlian Teknis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className="p-4 rounded-xl border"
                style={{ background: "var(--t-bg-card)", borderColor: "var(--t-border)" }}
              >
                <h3 className="text-xs uppercase font-bold mb-3" style={{ color: "var(--t-text-sub)" }}>
                  Programming & Frameworks
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[...skills.languages, ...skills.frameworks].map((s, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full text-xs font-medium border transition-all cursor-default"
                      style={{
                        background: "var(--t-accent-bg)",
                        color: "var(--t-accent)",
                        borderColor: "color-mix(in srgb, var(--t-accent) 30%, transparent)",
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div
                className="p-4 rounded-xl border"
                style={{ background: "var(--t-bg-card)", borderColor: "var(--t-border)" }}
              >
                <h3 className="text-xs uppercase font-bold mb-3" style={{ color: "var(--t-text-sub)" }}>
                  Software & Tools
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills.tools.map((s, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full text-xs font-medium border transition-all cursor-default"
                      style={{
                        background: "var(--t-bg)",
                        color: "var(--t-text-muted)",
                        borderColor: "var(--t-border)",
                      }}
                    >
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
