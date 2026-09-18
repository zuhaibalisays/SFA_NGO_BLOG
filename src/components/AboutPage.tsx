import { Heart, BookOpen, Users, Globe } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3 tracking-tight">
          About SFA Daily Articles
        </h1>
        <p className="text-[15px] text-slate-500 max-w-xl mx-auto leading-relaxed">
          A student-powered digital publication empowering young voices from Balochistan to share their stories, ideas, and aspirations with the world.
        </p>
      </div>

      {/* Mission */}
      <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm ring-1 ring-slate-100 mb-8">
        <h2 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2.5">
          <Heart className="text-amber-500" size={18} />
          Our Mission
        </h2>
        <p className="text-[14px] text-slate-600 leading-relaxed mb-4">
          School-for-All Welfare Organization (SFA) was established on <strong className="text-slate-800">October 1, 2020</strong> in
          <strong className="text-slate-800"> Turbat, Balochistan</strong>. Our mission is to promote education, empower youth, and create
          platforms for student expression in one of Pakistan's most underserved regions.
        </p>
        <p className="text-[14px] text-slate-600 leading-relaxed">
          SFA Daily Articles is our digital publishing initiative — a space where students can write, publish,
          and share their perspectives on education, social issues, literature, and community development.
          We believe that every young person has a story worth telling and a voice that deserves to be heard.
        </p>
      </div>

      {/* What We Do */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {[
          {
            icon: <BookOpen className="text-amber-500" size={18} />,
            title: 'Student Publishing',
            description: 'We provide a platform for students to write and publish articles, book reviews, stories, and letters on topics that matter to them and their communities.'
          },
          {
            icon: <Users className="text-amber-500" size={18} />,
            title: 'Community Building',
            description: 'We connect young writers across Balochistan, fostering a community of learners, thinkers, and changemakers who support each other\'s growth.'
          },
          {
            icon: <Globe className="text-amber-500" size={18} />,
            title: 'Digital Access',
            description: 'We bridge the digital divide by bringing student voices from rural Balochistan to a global audience through modern web technology.'
          },
          {
            icon: <Heart className="text-amber-500" size={18} />,
            title: 'Welfare Activities',
            description: 'Beyond publishing, SFA conducts educational support programs, health camps, and community outreach in Turbat and surrounding areas.'
          },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-xl p-5 shadow-sm ring-1 ring-slate-100">
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center mb-3 ring-1 ring-amber-200/50">
              {item.icon}
            </div>
            <h3 className="text-[14px] font-semibold text-slate-800 mb-1.5">{item.title}</h3>
            <p className="text-[12px] text-slate-500 leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>

      {/* Contact Info */}
      <div className="bg-slate-800 rounded-xl p-6 md:p-8">
        <h2 className="text-base font-semibold text-white mb-5">Get In Touch</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-[13px]">
          <div>
            <p className="text-amber-400 font-medium mb-0.5">Organization</p>
            <p className="text-slate-400">School-for-All Welfare Organization (SFA)</p>
          </div>
          <div>
            <p className="text-amber-400 font-medium mb-0.5">Location</p>
            <p className="text-slate-400">Turbat, District Kech, Balochistan, Pakistan</p>
          </div>
          <div>
            <p className="text-amber-400 font-medium mb-0.5">Established</p>
            <p className="text-slate-400">October 1, 2020</p>
          </div>
          <div>
            <p className="text-amber-400 font-medium mb-0.5">Focus Areas</p>
            <p className="text-slate-400">Education, Youth Empowerment, Community Development</p>
          </div>
        </div>
      </div>
    </div>
  );
}
