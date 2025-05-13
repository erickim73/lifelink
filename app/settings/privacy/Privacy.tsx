import React from 'react'

const Privacy = () => {
    return (
      <div className="space-y-6 w-full max-w-4xl">
        <h2 className="text-2xl font-semibold mb-6">Data Privacy</h2>
  
        <div className="space-y-4">
          <p className="text-lg">LifeLink believes in transparent data practices</p>
          <p>
            Keeping your data safe is a priority. Learn how your information is protected when using LifeLink products.
          </p>
  
          <div className="mt-8">
            <h3 className="text-xl font-medium mb-4">How we protect your data</h3>
            <ul className="space-y-2 list-disc pl-5">
              <li>By default, LifeLink doesn&apos;t train our generative models on your conversations.</li>
              <li>LifeLink doesn&apos;t sell your data to third parties.</li>
              <li>
                LifeLink deletes your data promptly when requested, except for safety violations or conversations you&apos;ve
                shared through feedback.
              </li>
            </ul>
          </div>
  
          <div className="mt-6">
            <h3 className="text-xl font-medium mb-4">How we use your data</h3>
            <ul className="space-y-2 list-disc pl-5">
              <li>
                LifeLink may use conversations flagged for safety violations to ensure safety of our systems for all
                users.
              </li>
              <li>
                LifeLink may use your email for account verification, billing, and LifeLink-led communications and
                marketing (e.g., emails sharing new product offerings and features).
              </li>
              <li>
                LifeLink may conduct aggregated, anonymized analysis of data to understand how people use our services.
              </li>
              <li>
                LifeLink may offer additional features, which will enable us to collect and use more of your data. You'll
                always be in control and can turn off these features in your account settings.
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
  
  export default Privacy
  