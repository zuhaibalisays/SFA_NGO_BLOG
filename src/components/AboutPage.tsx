import { Heart, BookOpen, Users, Globe } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-4 font-serif">
          About SFA Daily Articles
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          A student-powered digital publication empowering young voices from Balochistan to share their stories, ideas, and aspirations with the world.
        </p>
      </div>

      {/* Mission */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-slate-700 mb-8">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <Heart className="text-amber-500" size={22} />
          Our Mission
        </h2>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
          School-for-All Welfare Organization (SFA) was established on <strong>October 1, 2020</strong> in 
          <strong> Turbat, Balochistan</strong>. Our mission is to promote education, empower youth, and create 
          platforms for student expression in one of Pakistan's most underserved regions.
        </p>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
          SFA Daily Articles is our digital publishing initiative — a space where students can write, publish, 
          and share their perspectives on education, social issues, literature, and community development. 
          We believe that every young person has a story worth telling and a voice that deserves to be heard.
        </p>
      </div>

      {/* What We Do */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {[
          {
            icon: <BookOpen className="text-amber-500" size={24} />,
            title: 'Student Publishing',
            description: 'We provide a platform for students to write and publish articles, book reviews, stories, and letters on topics that matter to them and their communities.'
          },
          {
            icon: <Users className="text-amber-500" size={24} />,
            title: 'Community Building',
            description: 'We connect young writers across Balochistan, fostering a community of learners, thinkers, and changemakers who support each other\'s growth.'
          },
          {
            icon: <Globe className="text-amber-500" size={24} />,
            title: 'Digital Access',
            description: 'We bridge the digital divide by bringing student voices from rural Balochistan to a global audience through modern web technology.'
          },
          {
            icon: <Heart className="text-amber-500" size={24} />,
            title: 'Welfare Activities',
            description: 'Beyond publishing, SFA conducts educational support programs, health camps, and community outreach in Turbat and surrounding areas.'
          },
        ].map((item, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="w-12 h-12 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center mb-3">
              {item.icon}
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white mb-2">{item.title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
          </div>
        ))}
      </div>

      {/* Contact Info */}
      <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-xl p-6 md:p-8 text-white">
        <h2 className="text-xl font-bold mb-4">Get In Touch</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-amber-400 font-medium mb-1">Organization</p>
            <p className="text-white/70">School-for-All Welfare Organization (SFA)</p>
          </div>
          <div>
            <p className="text-amber-400 font-medium mb-1">Location</p>
            <p className="text-white/70">Turbat, District Kech, Balochistan, Pakistan</p>
          </div>
          <div>
            <p className="text-amber-400 font-medium mb-1">Established</p>
            <p className="text-white/70">October 1, 2020</p>
          </div>
          <div>
            <p className="text-amber-400 font-medium mb-1">Focus Areas</p>
            <p className="text-white/70">Education, Youth Empowerment, Community Development</p>
          </div>
        </div>
      </div>
    </div>
  );
}
