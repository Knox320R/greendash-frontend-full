import { motion } from 'framer-motion';
import { FaCar, FaMobileAlt, FaGlobe, FaCoins, FaLeaf } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const phaseColors = [
  'from-green-400 via-green-200 to-green-100',
  'from-blue-400 via-blue-200 to-blue-100',
  'from-yellow-400 via-yellow-200 to-yellow-100',
  'from-purple-400 via-purple-200 to-purple-100',
  'from-pink-400 via-pink-200 to-pink-100',
];

const roadmapData = [
  {
    id: 1,
    phase: 'Phase 1',
    title: 'Token Launch ($0.01 per Token)',
    icon: FaCoins,
    description: 'Attracting early participants and establishing a solid base of committed investors.',
    objectives: [
      'Create an engaged community and increase token adoption.'
    ],
    focus: [
      'Initial establishment of the token in the market.',
      'Building a strong base of investors who believe in the project and will act as its promoters.'
    ],
    imgSrc: '1.png',
    imgAlt: 'Token Launch Illustration',
  },
  {
    id: 2,
    phase: 'Phase 2',
    title: 'Implementation of the First Electric Vehicle Fleet',
    icon: FaCar,
    description: 'Integrate the first fleet of electric vehicles into the platform ecosystem.',
    objectives: [
      'Ensure the efficient operation of the fleet and demonstrate the viability of the model.'
    ],
    focus: [
      'Differentiation in the mobility market through the use of electric vehicles.',
      'Guaranteeing sustainability and optimizing operational costs.',
      'Attracting drivers and passengers who are environmentally conscious.'
    ],
    imgSrc: '2.png',
    imgAlt: 'Electric Vehicle Fleet Illustration',
  },
  {
    id: 3,
    phase: 'Phase 3',
    title: 'App Launch & Expansion to Pilot Cities',
    icon: FaMobileAlt,
    description: 'Launch the app in the first strategically selected pilot cities.',
    objectives: [
      'Test the app and adjust operations based on user feedback.'
    ],
    focus: [
      'Validating the user experience for both drivers and passengers.',
      "Refining the platform's performance in strategic cities.",
      'Preparing for a broader and more effective launch in the next phases.'
    ],
    imgSrc: '3.png',
    imgAlt: 'App Launch Illustration',
  },
  {
    id: 4,
    phase: 'Phase 4',
    title: 'Expansion to New Cities & Strategic Partnerships',
    icon: FaGlobe,
    description: 'Expand to new locations and establish partnerships with electric vehicle manufacturers and other key industry players.',
    objectives: [
      "Increase the platform's presence in new cities and strengthen the strategic partner network."
    ],
    focus: [
      'Geographical expansion and growth of the driver and passenger network.',
      'Partnerships with electric vehicle manufacturers to ensure an efficient and accessible fleet.'
    ],
    imgSrc: '4.png',
    imgAlt: 'Expansion Illustration',
  },
  {
    id: 5,
    phase: 'Phase 5',
    title: 'Full Integration & Profit Distribution',
    icon: FaLeaf,
    description: 'Ready for global expansion, with a fully operational fleet and regular profit distribution to token holders.',
    objectives: [
      'Establish eGreenDash as a reference in the decentralized and sustainable mobility market.'
    ],
    focus: [
      'Full integration of the platform.',
      'Profit distribution to investors.',
      'Long-term value retention for token holders.',
      'A fully operational and sustainable ecosystem.'
    ],
    imgSrc: '5.png',
    imgAlt: 'Profit Distribution Illustration',
  }
];

const RoadmapSection = () => {
  const { t } = useTranslation(['home', 'common']);
  
  return (
  <section className="py-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-50 via-white to-green-50">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 md:px-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-green-700 mb-8 tracking-tight drop-shadow-lg">{t('home:roadmap.title')}</h2>
        <p className="text-xl text-gray-600">
          {t('home:roadmap.subtitle')}
        </p>
      </div>
      <div className="relative">
        {/* Vertical timeline line */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-2 bg-gradient-to-b from-green-300 via-green-100 to-green-50 rounded-full z-0" style={{ minHeight: '100%', transform: 'translateX(-50%)' }} />
        <div className="flex flex-col gap-20">
          {roadmapData.map((phase, idx) => {
            const color = phaseColors[idx % phaseColors.length];
            return (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7 + idx * 0.1, delay: 0.1 * idx, ease: 'easeOut' }}
                viewport={{ once: true, amount: 0.3 }}
                className="relative flex flex-col items-center z-10"
              >
                {/* Large, prominent image above card */}
                <div className="relative flex justify-center w-full mb-0">
                  <div className={`absolute left-1/2 -translate-x-1/2 -top-4 w-44 h-44 rounded-full bg-gradient-to-br ${color} blur-md opacity-40 z-0`} />
                  <img
                    src={phase.imgSrc}
                    alt={phase.imgAlt}
                    className="relative z-10 w-40 h-40 object-cover rounded-3xl border-4 border-white shadow-2xl"
                  />
                </div>
                {/* Card content below image */}
                <div className={`relative bg-gradient-to-br ${color} rounded-2xl shadow-xl border-4 border-white px-6 py-6 mt-[-2.5rem] flex flex-col items-center max-w-xl w-full transition-all duration-300`}> 
                  {/* Icon and phase badge */}
                  <div className="flex flex-col items-center mb-2">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white shadow border-2 border-green-200 mb-1">
                      <phase.icon className="w-7 h-7 text-green-500" />
                    </div>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-white text-green-700 shadow border border-green-200 mb-1">{phase.phase}</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-gray-800 mb-1 text-center drop-shadow-lg">{phase.title}</h3>
                  <p className="text-base text-gray-700 mb-2 text-center font-medium leading-snug">{phase.description}</p>
                  <div className="mb-1 w-full">
                    <span className="font-semibold text-gray-800">Objective:</span>
                    <ul className="list-disc ml-6 text-gray-700 text-sm">
                      {phase.objectives.map((obj, i) => (
                        <li key={i}>{obj}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="w-full mb-1">
                    <span className="font-semibold text-gray-800">Focus:</span>
                    <ul className="list-disc ml-6 text-gray-700 text-sm">
                      {phase.focus.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  </section>
  );
};

export default RoadmapSection; 