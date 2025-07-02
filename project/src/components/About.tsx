import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Award, Users, Heart, Shield, Zap, Globe, Stethoscope, Brain, Activity } from 'lucide-react';

const About: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const achievements = [
    {
      icon: Award,
      title: 'Excellence Awards',
      description: 'Recognized for outstanding patient care',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: '200+ certified medical professionals',
      color: 'from-blue-500 to-purple-500'
    },
    {
      icon: Heart,
      title: 'Patient-Centered',
      description: 'Compassionate care at every step',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: Zap,
      title: 'AI Innovation',
      description: 'Cutting-edge technology integration',
      color: 'from-green-500 to-teal-500'
    }
  ];

  const features = [
    {
      icon: Stethoscope,
      title: 'Advanced Diagnostics',
      description: 'State-of-the-art medical equipment',
      color: 'from-blue-600 to-cyan-500'
    },
    {
      icon: Brain,
      title: 'AI-Powered Care',
      description: 'Intelligent health monitoring systems',
      color: 'from-purple-600 to-pink-500'
    },
    {
      icon: Activity,
      title: '24/7 Monitoring',
      description: 'Continuous patient care and support',
      color: 'from-green-600 to-emerald-500'
    }
  ];

  return (
    <section id="about" className="py-20 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 right-10 w-72 h-72 bg-teal-100 rounded-full blur-3xl opacity-30"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-10 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-20"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={inView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-medium mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              About Our Hospital
            </motion.div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-8">
              <span className="font-serif">Pioneering</span>{' '}
              <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                Healthcare Excellence
              </span>
            </h2>
            
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed mb-8">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Welcome to Srinivasa Hospital—your trusted partner in achieving optimal health and wellness. 
                For over 25 years, we've been at the forefront of medical innovation, combining cutting-edge 
                technology with compassionate care.
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Our revolutionary AI-powered appointment system represents the future of healthcare accessibility. 
                We believe that exceptional medical care should be convenient, efficient, and personalized to 
                each patient's unique needs.
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                From emergency care to specialized treatments, our world-class facilities and expert medical 
                team are dedicated to delivering outcomes that exceed expectations while maintaining the highest 
                standards of safety and comfort.
              </motion.p>
            </div>

            {/* Achievements Grid */}
            <motion.div
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  className="group p-4 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${achievement.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <achievement.icon className="text-white" size={24} />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1">{achievement.title}</h3>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Lottie Animation and Feature Cards */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={inView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              {/* Main Lottie Animation Container */}
              <motion.div
                className="relative z-10 bg-gradient-to-br from-teal-50 to-blue-50 rounded-3xl p-8 shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                {/* Robot Animation Placeholder - Replace with actual Lottie */}
                <div className="w-full h-80 flex items-center justify-center bg-gradient-to-br from-teal-100 to-blue-100 rounded-2xl mb-6">
                  <motion.div
                    className="w-32 h-32 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center"
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <motion.div
                      className="text-white text-4xl font-bold"
                      animate={{
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      🤖
                    </motion.div>
                  </motion.div>
                </div>
                
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Experience the Future of Healthcare
                  </h3>
                  <p className="text-gray-600">
                    AI-powered assistance for seamless healthcare experience
                  </p>
                </div>
              </motion.div>
              
              {/* Feature Cards */}
              <div className="mt-8 space-y-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-4 p-4 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                    initial={{ opacity: 0, x: 20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <feature.icon className="text-white" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Floating Cards */}
              <motion.div
                className="absolute -top-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <Shield className="text-white" size={20} />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">ISO Certified</div>
                    <div className="text-sm text-gray-600">Quality Assured</div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                className="absolute -bottom-6 -right-6 bg-gradient-to-r from-teal-500 to-blue-600 text-white p-6 rounded-2xl shadow-xl"
                animate={{
                  y: [0, 10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                <div className="flex items-center space-x-3">
                  <Globe className="text-white" size={24} />
                  <div>
                    <div className="font-semibold">Global Standards</div>
                    <div className="text-sm opacity-90">World-Class Care</div>
                  </div>
                </div>
              </motion.div>

              {/* Background Decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-teal-400/10 to-blue-400/10 rounded-3xl blur-3xl transform rotate-6 scale-105 -z-10"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;