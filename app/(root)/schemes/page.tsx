"use client";

import { useState } from "react";
import Link from "next/link";

interface SchemeDetail {
  title: string;
  description: string;
  eligibility: string;
  benefits: string[];
  link: string;
}

interface SchemeData {
  [key: string]: SchemeDetail;
}

const HealthcareSchemes = () => {
  const [activeScheme, setActiveScheme] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Scheme details data
  const schemeDetails: SchemeData = {
    ayushman: {
      title: "Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana (PM-JAY)",
      description: "Ayushman Bharat PM-JAY is the world's largest government-funded health assurance scheme covering 10.74 crore poor and vulnerable families (approximately 50 crore beneficiaries). It provides a health cover of ₹5 lakhs per family per year for secondary and tertiary care hospitalization across public and private empanelled hospitals in India.",
      eligibility: "Families identified based on deprivation and occupational criteria as per SECC data. The scheme covers poor, deprived rural families and identified occupational categories of urban workers' families.",
      benefits: [
        "Cashless and paperless access to services at the point of service",
        "Coverage of 3 days pre-hospitalization and 15 days post-hospitalization expenses",
        "No restrictions on family size, age, or gender",
        "Coverage for 1,573 procedures including surgeries, medical treatments, and day care procedures",
        "All pre-existing conditions covered from day one"
      ],
      link: "https://pmjay.gov.in/"
    },
    pmsby: {
      title: "Pradhan Mantri Suraksha Bima Yojana (PMSBY)",
      description: "PMSBY is an accident insurance scheme offering coverage for death or disability due to accident. It offers a one-year accidental death and disability cover which can be renewed annually.",
      eligibility: "Available to people in the age group 18 to 70 years with a bank account. Premium of ₹12 per annum is auto-debited from the account.",
      benefits: [
        "₹2 lakh for accidental death or full disability",
        "₹1 lakh for partial disability",
        "Simple and easy enrollment through banks",
        "Long-term option of auto-debit facility",
        "Pure risk coverage at extremely affordable premium"
      ],
      link: "https://financialservices.gov.in/insurance-divisions/Government-Sponsored-Socially-Oriented-Insurance-Schemes/Pradhan-Mantri-Suraksha-Bima-Yojana(PMSBY)"
    },
    pmjdy: {
      title: "Pradhan Mantri Jan Arogya Yojana (PMJAY)",
      description: "PMJAY is the health component of Ayushman Bharat, aimed at providing health coverage to economically vulnerable sections. It's designed to reduce catastrophic out-of-pocket health expenditure and improve access to quality healthcare.",
      eligibility: "Eligible families as per the Socio-Economic Caste Census (SECC) database. The scheme automatically covers families identified based on deprivation criteria.",
      benefits: [
        "Health coverage up to ₹5 lakh per family per year",
        "Covers medical and hospitalization expenses for almost all secondary care and most tertiary care procedures",
        "Includes pre and post hospitalization expenses",
        "Cashless and paperless treatment at empanelled hospitals",
        "No restriction on family size or age"
      ],
      link: "https://nha.gov.in/PM-JAY"
    },
    nrhm: {
      title: "National Rural Health Mission (NRHM)",
      description: "NRHM was launched to provide accessible, affordable, and quality healthcare to the rural population, especially vulnerable groups. It aims to establish a fully functional, community-owned, decentralized health delivery system.",
      eligibility: "All rural residents, with special focus on 18 states with weak public health indicators and infrastructure.",
      benefits: [
        "Reproductive, Maternal, Newborn, Child, and Adolescent Health (RMNCH+A) services",
        "Strengthening of rural hospitals and health centers",
        "Mobile Medical Units for remote areas",
        "Free essential drugs and diagnostic services",
        "Community participation through ASHA workers",
        "District health action plans based on local needs"
      ],
      link: "https://nhm.gov.in/"
    },
    rsby: {
      title: "Rashtriya Swasthya Bima Yojana (RSBY)",
      description: "RSBY was designed to provide health insurance coverage to Below Poverty Line (BPL) families. It provides protection from financial liabilities arising out of health shocks that involve hospitalization.",
      eligibility: "BPL families as per state BPL list. The scheme has now been subsumed under Ayushman Bharat - PMJAY with expanded coverage and benefits.",
      benefits: [
        "Hospitalization coverage up to ₹30,000 per annum for a family of five",
        "Coverage for most diseases requiring hospitalization",
        "Transportation costs of ₹100 per visit with an annual cap of ₹1,000",
        "Cashless treatment at empanelled hospitals",
        "Smart card-based system ensuring portability across the country"
      ],
      link: "https://www.india.gov.in/spotlight/rashtriya-swasthya-bima-yojana"
    },
    jssk: {
      title: "Janani Shishu Suraksha Karyakram (JSSK)",
      description: "JSSK entitles all pregnant women delivering in public health institutions to absolutely free and no expense delivery including Cesarean section. The initiative also provides for free transport from home to institution, between facilities in case of referral and drop back home.",
      eligibility: "All pregnant women and sick infants (up to 1 year after birth) accessing public health institutions for delivery and treatment.",
      benefits: [
        "Free delivery (normal or cesarean) at public health facilities",
        "Free drugs and consumables",
        "Free diagnostics",
        "Free diet during stay at the facility (up to 3 days for normal delivery, 7 days for C-section)",
        "Free transport between home and health institutions",
        "Free treatment for sick infants up to one year of age"
      ],
      link: "https://nhm.gov.in/index1.php?lang=1&level=3&sublinkid=842&lid=308"
    },
    jsy: {
      title: "Janani Suraksha Yojana (JSY)",
      description: "JSY is a safe motherhood intervention under the National Rural Health Mission. It promotes institutional delivery among poor pregnant women to reduce maternal and neonatal mortality by providing conditional cash assistance.",
      eligibility: "Focus on Low Performing States (LPS) where institutional delivery rates are low. Different eligibility criteria and benefits for rural/urban areas and low/high performing states.",
      benefits: [
        "Cash incentive for institutional delivery: ₹1,400 for rural areas and ₹1,000 for urban areas in LPS",
        "Cash incentive to ASHA workers for facilitating institutional delivery",
        "Additional incentive for BPL women in high performing states",
        "Free ante-natal check-ups",
        "Assistance with transportation to medical facilities"
      ],
      link: "https://nhm.gov.in/index1.php?lang=1&level=3&sublinkid=841&lid=309"
    },
    asha: {
      title: "ASHA (Accredited Social Health Activist) Program",
      description: "ASHA is a community health worker instituted by the government under the National Rural Health Mission (NRHM). ASHAs are local women trained to act as health educators and promoters in their communities, creating awareness on health and its social determinants.",
      eligibility: "The program benefits rural communities by providing a link between the healthcare system and the community. Each ASHA worker covers approximately 1,000 rural population.",
      benefits: [
        "First-port of call for any health-related demands of rural populations",
        "Counseling women on birth preparedness, safe delivery, breastfeeding, immunization",
        "Providing primary medical care for minor ailments like diarrhea, fevers",
        "Escorting pregnant women and children requiring treatment to health centers",
        "Promoting construction of household toilets",
        "Spreading awareness about health insurance schemes"
      ],
      link: "https://nhm.gov.in/index1.php?lang=1&level=3&sublinkid=184&lid=257"
    }
  };

  // Function to open modal
  const openModal = (schemeId: string) => {
    setActiveScheme(schemeId);
    setIsModalOpen(true);
    // Prevent scrolling on the body
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  };

  // Function to close modal
  const closeModal = () => {
    setIsModalOpen(false);
    // Enable scrolling on the body
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'auto';
    }
  };

  // Handle click outside modal
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // Handle escape key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="bg-blue-100 rounded-lg px-6 py-12 mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-900 mb-4">
            Healthcare Schemes for People Living in Rural Areas
          </h1>
          <p className="max-w-3xl mx-auto text-gray-600 text-lg">
            Access to healthcare is a fundamental right for every citizen. The Government of India has implemented several healthcare schemes specifically designed to address the unique challenges faced by rural communities. Explore the available schemes and benefits below.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Scheme Cards */}
          {Object.entries(schemeDetails).map(([id, scheme], index) => {
            // Determine card color based on index
            const headerColors = [
              "bg-blue-100", "bg-green-100", "bg-yellow-50",
              "bg-red-100", "bg-purple-100", "bg-blue-100",
              "bg-green-100", "bg-yellow-50"
            ];
            const headerColor = headerColors[index % headerColors.length];

            return (
              <div
                key={id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer overflow-hidden"
                onClick={() => openModal(id)}
              >
                <div className={`p-4 font-medium text-lg ${headerColor}`}>
                  {scheme.title.length > 40
                    ? scheme.title.substring(0, 40) + '...'
                    : scheme.title}
                </div>
                <div className="p-4">
                  <p className="text-gray-600 text-sm">
                    {scheme.description.substring(0, 100)}...
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal */}
        {isModalOpen && activeScheme && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={handleOutsideClick}
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-xl font-semibold">
                  {schemeDetails[activeScheme].title}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  &times;
                </button>
              </div>

              <div className="p-6">
                <p className="text-gray-700 mb-6">
                  {schemeDetails[activeScheme].description}
                </p>

                <div className="bg-yellow-50 p-4 rounded-md mb-6">
                  <h4 className="font-medium mb-2">Eligibility</h4>
                  <p className="text-gray-700">
                    {schemeDetails[activeScheme].eligibility}
                  </p>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium mb-2">Benefits</h4>
                  <ul className="list-disc pl-5 text-gray-700 space-y-1">
                    {schemeDetails[activeScheme].benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={schemeDetails[activeScheme].link}
                  target="_blank"
                  className="inline-block bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-md font-medium transition-colors"
                >
                  Visit Official Website
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthcareSchemes;
