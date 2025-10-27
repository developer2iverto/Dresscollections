import React from 'react'

const CareInstructions: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Care Instructions</h1>
      <p className="text-gray-600 mb-8">
        Keep your garments looking fresh and lasting longer with these simple care tips.
      </p>

      <div className="space-y-8">
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Washing</h2>
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>Machine wash cold (30°C) for most cotton and blends.</li>
            <li>Use mild detergent and wash darks and lights separately.</li>
            <li>Turn garments inside out to reduce friction and fading.</li>
            <li>Hand wash delicate fabrics like silk and lace.</li>
          </ul>
        </section>

        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Drying</h2>
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>Tumble dry on low heat where allowed; avoid high heat.</li>
            <li>Lay flat to dry for knitwear to maintain shape.</li>
            <li>Hang dry to reduce wrinkles and save energy.</li>
          </ul>
        </section>

        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Ironing</h2>
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>Iron on medium heat; use steam for stubborn wrinkles.</li>
            <li>Use a pressing cloth on delicate fabrics.</li>
            <li>Check the care label for fabric-specific instructions.</li>
          </ul>
        </section>

        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">General Tips</h2>
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>Do not bleach unless the care label explicitly allows it.</li>
            <li>Wash similar colors together to prevent color transfer.</li>
            <li>Store garments in a cool, dry place away from direct sunlight.</li>
          </ul>
        </section>
      </div>
    </div>
  )
}

export default CareInstructions