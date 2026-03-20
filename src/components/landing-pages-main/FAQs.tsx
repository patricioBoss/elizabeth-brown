'use client';

/* This example requires Tailwind CSS v2.0+ */
import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: 'Why Investing?',
    answer:
      "The earlier you start investing, the longer your money will be able to work in your favor! Get started investing as soon as you start earning your first penny!, One of the main benefits of investing is that the money you invest has the potential to grow substantially over time. Rather than just putting your money into a savings account to save for the future, investing is can be a much smarter way to make your money work for you.",
  },
  {
    question: 'Is it better to save or invest?',
    answer:
      'Investing provides the potential for (significantly) higher returns than saving. As your investments grow, they allow you to take advantage of compounding to accelerate gains. Investing offers many different access points and strategies, from individual stocks and bonds to mutual or exchange-traded funds.',
  },
  {
    question: 'What is the process for signing up with Us?',
    answer: `
      Want to signup? Sure, here's a simple step-by-step guide on how to sign up and get started:<br/>
1. Open your preferred web browser and navigate to the website.<br/>
2. Look for the "Sign Up" or "Register" button and click on it to start the registration process.<br/>
3. Fill in your personal information, including your name, email address, country and location.<br/>
4. Choose a strong password and confirm it.<br/>
5. Complete any additional verification steps required by the app, such as Id or passport verification.<br/>
6. Provide your financial information, such as your various withdrawal wallet details, fund your account and start investing.<br/>
7. Once your account is set up, you can start exploring the app's features, such as browsing available investments and plans, making investment etc.<br/>
      `,
  },
  {
    question:
      'What elements are evaluated when strategically allocating assets in portfolios?',
    answer:
      "When managing portfolios, we consider various asset classes such as stocks, bonds, real estate, and alternative investments. Each asset class is evaluated based on its risk-return profile, correlation with other assets, and its role in achieving diversification. We aim to construct portfolios that balance risk and return by allocating assets strategically according to your investment objectives and risk tolerance, our approach involves monitoring and adjusting the allocation of assets over time to adapt to changes in market conditions and economic outlooks.",
  },
  {
    question:
      'Why should you trust Us, and what makes us stand out from the rest?',
    answer:
      "At Elizabeth Mende Brown Wealth Management, we're dedicated to providing accessible and user-friendly investment solutions. With a team of experienced professionals, we aim to empower individuals to achieve their financial goals through innovative and transparent investment opportunities. Our platform offers a diverse range of assets and personalized services tailored to your needs, ensuring a seamless and rewarding investment experience.",
  },
];

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}

const FAQs: React.FC = () => {
  return (
    <div id="faqs" className="bg-gray-50 pt-28">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto divide-y-2 divide-gray-200">
          <h2 className="text-center text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Frequently asked questions
          </h2>
          <dl className="mt-6 space-y-6 divide-y divide-gray-200">
            {faqs.map((faq) => (
              <Disclosure as="div" key={faq.question} className="pt-6">
                {({ open }) => (
                  <>
                    <dt className="text-lg">
                      <Disclosure.Button className="text-left w-full flex justify-between items-start text-gray-400">
                        <span className="font-semibold text-gray-900">
                          {faq.question}
                        </span>
                        <span className="ml-6 h-7 flex items-center">
                          <ChevronDownIcon
                            className={classNames(
                              open ? '-rotate-180' : 'rotate-0',
                              'h-6 w-6 transform'
                            )}
                            aria-hidden="true"
                          />
                        </span>
                      </Disclosure.Button>
                    </dt>
                    <Disclosure.Panel as="dd" className="mt-2 pr-12">
                      <p
                        className="text-base text-gray-500"
                        dangerouslySetInnerHTML={{ __html: faq.answer }}
                      />
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default FAQs;
