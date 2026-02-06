import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Send, Mail, MapPin, Linkedin, Terminal, ArrowRight } from 'lucide-react';

export const Contact = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
    toast.success("Message received! I will get back to you soon.", {
      style: {
        background: '#112240',
        color: '#00ff9f',
        border: '1px solid #00ff9f33'
      }
    });
    reset();
  };

  return (
    <section id="contact" className="py-24 bg-[#0a192f] border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <h2 className="text-[#00ff9f] font-mono text-sm tracking-widest uppercase mb-4">Contact</h2>
            <h3 className="text-5xl font-bold text-white mb-8 tracking-tight">Let's connect.</h3>
            <p className="text-xl text-slate-400 mb-12 max-w-md leading-relaxed">
              Whether you have a technical project, a GIS data challenge, or just want to say hi, my inbox is always open.
            </p>

            <div className="space-y-6">
              <a href="mailto:ultazanagan111@gmail.com" className="group flex items-center gap-4 p-4 rounded-xl bg-[#112240]/50 border border-slate-800 hover:border-[#00ff9f]/30 transition-all">
                <div className="w-12 h-12 bg-[#0a192f] rounded-lg flex items-center justify-center text-[#00ff9f] border border-[#00ff9f]/20">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold">Email Me</p>
                  <p className="text-lg text-white group-hover:text-[#00ff9f] transition-colors">ultazanagan111@gmail.com</p>
                </div>
              </a>
              
              <a href="https://linkedin.com/in/ul-tazasyah-274a2a392" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 p-4 rounded-xl bg-[#112240]/50 border border-slate-800 hover:border-[#00d4ff]/30 transition-all">
                <div className="w-12 h-12 bg-[#0a192f] rounded-lg flex items-center justify-center text-[#00d4ff] border border-[#00d4ff]/20">
                  <Linkedin size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold">LinkedIn</p>
                  <p className="text-lg text-white group-hover:text-[#00d4ff] transition-colors">Ul Tazasyah</p>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-[#112240]/50 border border-slate-800">
                <div className="w-12 h-12 bg-[#0a192f] rounded-lg flex items-center justify-center text-slate-400 border border-slate-700">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold">Location</p>
                  <p className="text-lg text-white">Nagan Raya, Aceh</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#112240] p-8 md:p-12 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00ff9f]/5 blur-[100px]" />
            <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-[#00ff9f] uppercase tracking-wider">Your Name</label>
                  <input
                    {...register("name", { required: true })}
                    className="w-full bg-[#0a192f] border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00ff9f] transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-[#00ff9f] uppercase tracking-wider">Email Address</label>
                  <input
                    {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
                    className="w-full bg-[#0a192f] border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00ff9f] transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-[#00ff9f] uppercase tracking-wider">Subject</label>
                <input
                  {...register("subject")}
                  className="w-full bg-[#0a192f] border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00ff9f] transition-all"
                  placeholder="Inquiry about Project"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-[#00ff9f] uppercase tracking-wider">Message</label>
                <textarea
                  {...register("message", { required: true })}
                  rows={5}
                  className="w-full bg-[#0a192f] border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00ff9f] transition-all resize-none"
                  placeholder="How can I help you today?"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#00ff9f] text-[#0a192f] py-4 rounded-lg font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#00e08b] transition-all shadow-lg shadow-[#00ff9f]/20 group"
              >
                Execute Send <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
