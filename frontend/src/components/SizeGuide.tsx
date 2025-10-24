import { useState } from 'react'
import { X, Ruler, Info } from 'lucide-react'

interface SizeGuideProps {
  isOpen: boolean
  onClose: () => void
  category: string
  gender: string
}

const SizeGuide = ({ isOpen, onClose, category, gender }: SizeGuideProps) => {
  const [activeTab, setActiveTab] = useState('chart')
  const [selectedSize, setSelectedSize] = useState('')

  if (!isOpen) return null

  // Size charts for different categories and genders
  const sizeCharts = {
    'mens-wear': {
      't-shirts': {
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        measurements: [
          { size: 'S', chest: '36-38', waist: '30-32', length: '27' },
          { size: 'M', chest: '38-40', waist: '32-34', length: '28' },
          { size: 'L', chest: '40-42', waist: '34-36', length: '29' },
          { size: 'XL', chest: '42-44', waist: '36-38', length: '30' },
          { size: 'XXL', chest: '44-46', waist: '38-40', length: '31' }
        ]
      },
      'jeans': {
        sizes: ['28', '30', '32', '34', '36', '38'],
        measurements: [
          { size: '28', waist: '28', hip: '36', inseam: '32' },
          { size: '30', waist: '30', hip: '38', inseam: '32' },
          { size: '32', waist: '32', hip: '40', inseam: '32' },
          { size: '34', waist: '34', hip: '42', inseam: '32' },
          { size: '36', waist: '36', hip: '44', inseam: '32' },
          { size: '38', waist: '38', hip: '46', inseam: '32' }
        ]
      }
    },
    'womens-wear': {
      'dresses': {
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        measurements: [
          { size: 'XS', bust: '32-34', waist: '24-26', hip: '34-36', length: '35' },
          { size: 'S', bust: '34-36', waist: '26-28', hip: '36-38', length: '36' },
          { size: 'M', bust: '36-38', waist: '28-30', hip: '38-40', length: '37' },
          { size: 'L', bust: '38-40', waist: '30-32', hip: '40-42', length: '38' },
          { size: 'XL', bust: '40-42', waist: '32-34', hip: '42-44', length: '39' }
        ]
      },
      'sweaters': {
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        measurements: [
          { size: 'XS', bust: '32-34', waist: '26-28', length: '24' },
          { size: 'S', bust: '34-36', waist: '28-30', length: '25' },
          { size: 'M', bust: '36-38', waist: '30-32', length: '26' },
          { size: 'L', bust: '38-40', waist: '32-34', length: '27' },
          { size: 'XL', bust: '40-42', waist: '34-36', length: '28' }
        ]
      }
    },
    'kids-wear': {
      't-shirts': {
        sizes: ['4T', '5T', '6T', '7T'],
        measurements: [
          { size: '4T', chest: '22-23', waist: '21-22', length: '16' },
          { size: '5T', chest: '23-24', waist: '22-23', length: '17' },
          { size: '6T', chest: '24-25', waist: '23-24', length: '18' },
          { size: '7T', chest: '25-26', waist: '24-25', length: '19' }
        ]
      }
    }
  }

  const getCurrentChart = () => {
    const genderKey = gender === 'men' ? 'mens-wear' : gender === 'women' ? 'womens-wear' : 'kids-wear'
    const categoryChart = sizeCharts[genderKey as keyof typeof sizeCharts]
    
    if (!categoryChart) return null
    
    // Find the best matching category
    const subcategory = Object.keys(categoryChart).find(key => 
      category.includes(key) || key.includes(category)
    )
    
    return subcategory ? categoryChart[subcategory as keyof typeof categoryChart] : null
  }

  const chart = getCurrentChart()

  const measurementTips = [
    {
      title: 'Chest/Bust',
      description: 'Measure around the fullest part of your chest/bust, keeping the tape horizontal.'
    },
    {
      title: 'Waist',
      description: 'Measure around your natural waistline, which is the narrowest part of your torso.'
    },
    {
      title: 'Hip',
      description: 'Measure around the fullest part of your hips, about 8 inches below your waist.'
    },
    {
      title: 'Length',
      description: 'For tops: measure from the highest point of your shoulder to your desired length.'
    },
    {
      title: 'Inseam',
      description: 'For pants: measure from the crotch seam to the bottom of the leg.'
    }
  ]

  const fitGuide = {
    slim: 'Close-fitting silhouette that follows the body\'s natural shape',
    regular: 'Classic fit with comfortable room for movement',
    loose: 'Relaxed fit with extra room for comfort and layering',
    oversized: 'Deliberately loose and roomy for a trendy, comfortable look'
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Size Guide</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('chart')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'chart'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Size Chart
          </button>
          <button
            onClick={() => setActiveTab('measure')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'measure'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            How to Measure
          </button>
          <button
            onClick={() => setActiveTab('fit')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'fit'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Fit Guide
          </button>
        </div>

        <div className="p-6">
          {/* Size Chart Tab */}
          {activeTab === 'chart' && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Size Chart</h3>
                <p className="text-gray-600">All measurements are in inches</p>
              </div>

              {chart ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-2 text-left">Size</th>
                        {Object.keys(chart.measurements[0]).filter(key => key !== 'size').map(key => (
                          <th key={key} className="border border-gray-300 px-4 py-2 text-left capitalize">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {chart.measurements.map((measurement, index) => (
                        <tr
                          key={measurement.size}
                          className={`${
                            selectedSize === measurement.size ? 'bg-purple-50' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedSize(measurement.size)}
                        >
                          <td className="border border-gray-300 px-4 py-2 font-medium">
                            {measurement.size}
                          </td>
                          {Object.entries(measurement).filter(([key]) => key !== 'size').map(([key, value]) => (
                            <td key={key} className="border border-gray-300 px-4 py-2">
                              {value}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Size chart not available for this category.</p>
                </div>
              )}

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                  <div>
                    <h4 className="font-medium text-blue-900">Sizing Tips</h4>
                    <ul className="text-sm text-blue-800 mt-1 space-y-1">
                      <li>• If you're between sizes, we recommend sizing up for a more comfortable fit</li>
                      <li>• Consider the fit type (slim, regular, loose) when choosing your size</li>
                      <li>• Check the specific measurements for the most accurate fit</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* How to Measure Tab */}
          {activeTab === 'measure' && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">How to Measure</h3>
                <p className="text-gray-600">Follow these steps for accurate measurements</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-4 flex items-center">
                    <Ruler className="h-5 w-5 mr-2 text-purple-600" />
                    Measurement Guide
                  </h4>
                  <div className="space-y-4">
                    {measurementTips.map((tip, index) => (
                      <div key={index} className="border-l-4 border-purple-200 pl-4">
                        <h5 className="font-medium text-gray-900">{tip.title}</h5>
                        <p className="text-sm text-gray-600 mt-1">{tip.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4">General Tips</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Use a flexible measuring tape for best results
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Measure over your undergarments or close-fitting clothes
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Keep the tape snug but not tight
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Stand straight and breathe normally while measuring
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Have someone help you for more accurate measurements
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Fit Guide Tab */}
          {activeTab === 'fit' && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Fit Guide</h3>
                <p className="text-gray-600">Understanding different fit types</p>
              </div>

              <div className="grid gap-4">
                {Object.entries(fitGuide).map(([fit, description]) => (
                  <div key={fit} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 capitalize mb-2">{fit} Fit</h4>
                    <p className="text-gray-600">{description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">Need Help Choosing?</h4>
                <p className="text-sm text-yellow-800">
                  If you're unsure about sizing or fit, our customer service team is here to help! 
                  Contact us at <span className="font-medium">support@stylehub.com</span> or call us at 
                  <span className="font-medium"> 1-800-STYLE-HUB</span>.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SizeGuide