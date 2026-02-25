import LoadingSpinner from '../components/LoadingSpinner'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { patternsAPI, uploadAPI } from '../services/api'

function UploadPatternPage() {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  
  const [categories, setCategories] = useState([])
  const [difficulties, setDifficulties] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    difficulty_id: '',
    designer_name: user?.full_name || '',
    tags: ''
  })
  
  const [files, setFiles] = useState({
    pdfFile: null,
    imageFile: null
  })

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    loadCategories()
    loadDifficulties()
  }, [isAuthenticated])

  const loadCategories = async () => {
    try {
      const data = await patternsAPI.getCategories()
      setCategories(data.categories)
    } catch (error) {
      console.error('Failed to load categories:', error)
    }
  }

  const loadDifficulties = async () => {
    try {
      const data = await patternsAPI.getDifficulties()
      setDifficulties(data.difficulties)
    } catch (error) {
      console.error('Failed to load difficulties:', error)
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target
    if (selectedFiles && selectedFiles[0]) {
      setFiles({
        ...files,
        [name]: selectedFiles[0]
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!files.pdfFile) {
      alert('Please upload a PDF pattern file')
      return
    }
    
    if (!files.imageFile) {
      alert('Please upload a preview image')
      return
    }

    try {
      setLoading(true)
      
      // Step 1: Upload PDF file
      setUploadProgress('Uploading PDF file...')
      const pdfResponse = await uploadAPI.uploadPatternFile(files.pdfFile)
      
      // Step 2: Upload image file
      setUploadProgress('Uploading preview image...')
      const imageResponse = await uploadAPI.uploadPatternImage(files.imageFile)
      
      // Step 3: Create pattern with file paths
      setUploadProgress('Creating pattern...')
      const patternData = {
        title: formData.title,
        description: formData.description,
        category_id: parseInt(formData.category_id),
        difficulty_id: parseInt(formData.difficulty_id),
        designer_name: formData.designer_name,
        pdf_file: pdfResponse.file.file_path,
        preview_image: imageResponse.file.file_path,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
      }
      
      console.log('Submitting pattern data:', patternData)
      
      await patternsAPI.createPattern(patternData)
      
      setUploadProgress('Success!')
      alert('Pattern uploaded successfully! It will be reviewed by an admin.')
      navigate('/dashboard')
      
    } catch (error) {
      console.error('Upload failed:', error)
      console.error('Error response:', error.response)
      console.error('Error data:', error.response?.data)
      alert('Failed to upload pattern: ' + (error.response?.data?.error || error.message))
    } finally {
      setLoading(false)
      setUploadProgress('')
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen px-6 py-8 bg-pattern-soft">
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-8">
          <h1 
            style={{ color: '#1F2F3A' }}
            className="text-4xl font-bold mb-2"
          >
            Upload Pattern
          </h1>
          <p style={{ color: '#6E8594' }}>
            Share your sewing pattern with the community
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          
          <div 
            style={{ backgroundColor: '#8FA9B6' }}
            className="rounded-xl p-8 mb-6"
          >
            <h2 
              style={{ color: '#1F2F3A' }}
              className="text-2xl font-bold mb-6"
            >
              Pattern Details
            </h2>

            {/* Title */}
            <div className="mb-4">
              <label 
                style={{ color: '#1F2F3A' }}
                className="block text-sm font-medium mb-2"
              >
                Pattern Title *
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                style={{ backgroundColor: '#E9DDC9', color: '#1F2F3A' }}
                className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="e.g., Summer Maxi Dress"
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label 
                style={{ color: '#1F2F3A' }}
                className="block text-sm font-medium mb-2"
              >
                Description *
              </label>
              <textarea
                name="description"
                required
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                style={{ backgroundColor: '#E9DDC9', color: '#1F2F3A' }}
                className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Describe your pattern, including details about fit, fabric recommendations, and skill level..."
              />
            </div>

            {/* Category */}
            <div className="mb-4">
              <label 
                style={{ color: '#1F2F3A' }}
                className="block text-sm font-medium mb-2"
              >
                Category *
              </label>
              <select
                name="category_id"
                required
                value={formData.category_id}
                onChange={handleInputChange}
                style={{ backgroundColor: '#E9DDC9', color: '#1F2F3A' }}
                className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty */}
            <div className="mb-4">
              <label 
                style={{ color: '#1F2F3A' }}
                className="block text-sm font-medium mb-2"
              >
                Difficulty Level *
              </label>
              <select
                name="difficulty_id"
                required
                value={formData.difficulty_id}
                onChange={handleInputChange}
                style={{ backgroundColor: '#E9DDC9', color: '#1F2F3A' }}
                className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select difficulty level</option>
                {difficulties.map((diff) => (
                  <option key={diff.id} value={diff.id}>
                    {diff.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Designer Name */}
            <div className="mb-4">
              <label 
                style={{ color: '#1F2F3A' }}
                className="block text-sm font-medium mb-2"
              >
                Designer Name *
              </label>
              <input
                type="text"
                name="designer_name"
                required
                value={formData.designer_name}
                onChange={handleInputChange}
                style={{ backgroundColor: '#E9DDC9', color: '#1F2F3A' }}
                className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Your name or studio name"
              />
            </div>

            {/* Tags */}
            <div className="mb-4">
              <label 
                style={{ color: '#1F2F3A' }}
                className="block text-sm font-medium mb-2"
              >
                Tags (comma-separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                style={{ backgroundColor: '#E9DDC9', color: '#1F2F3A' }}
                className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="e.g., summer, casual, cotton, beginner-friendly"
              />
              <p style={{ color: '#6E8594' }} className="text-xs mt-1">
                Separate tags with commas
              </p>
            </div>

          </div>

          {/* File Uploads */}
          <div 
            style={{ backgroundColor: '#8FA9B6' }}
            className="rounded-xl p-8 mb-6"
          >
            <h2 
              style={{ color: '#1F2F3A' }}
              className="text-2xl font-bold mb-6"
            >
              Files
            </h2>

            {/* PDF Upload */}
            <div className="mb-6">
              <label 
                style={{ color: '#1F2F3A' }}
                className="block text-sm font-medium mb-2"
              >
                Pattern PDF File *
              </label>
              <input
                type="file"
                name="pdfFile"
                accept=".pdf"
                required
                onChange={handleFileChange}
                style={{ backgroundColor: '#E9DDC9', color: '#1F2F3A' }}
                className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <p style={{ color: '#6E8594' }} className="text-xs mt-1">
                Upload your pattern as a PDF file
              </p>
              {files.pdfFile && (
                <p style={{ color: '#1F2F3A' }} className="text-sm mt-2">
                  Selected: {files.pdfFile.name}
                </p>
              )}
            </div>

            {/* Image Upload */}
            <div className="mb-4">
              <label 
                style={{ color: '#1F2F3A' }}
                className="block text-sm font-medium mb-2"
              >
                Preview Image *
              </label>
              <input
                type="file"
                name="imageFile"
                accept="image/png, image/jpeg, image/jpg, image/gif"
                required
                onChange={handleFileChange}
                style={{ backgroundColor: '#E9DDC9', color: '#1F2F3A' }}
                className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <p style={{ color: '#6E8594' }} className="text-xs mt-1">
                Upload a preview image (PNG, JPG, or GIF)
              </p>
              {files.imageFile && (
                <p style={{ color: '#1F2F3A' }} className="text-sm mt-2">
                  Selected: {files.imageFile.name}
                </p>
              )}
            </div>

          </div>

          {/* Upload Progress */}
          {uploadProgress && (
            <div 
              style={{ backgroundColor: '#8FA9B6' }}
              className="rounded-xl p-8 mb-6"
            >
              <LoadingSpinner size="medium" text={uploadProgress} />
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: '#5C768A' }}
              className="flex-1 py-4 text-white rounded-lg font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Uploading...' : 'Submit Pattern'}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              style={{ backgroundColor: '#E9DDC9', color: '#1F2F3A' }}
              className="px-8 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity"
            >
              Cancel
            </button>
          </div>

          <p 
            style={{ color: '#6E8594' }}
            className="text-sm text-center mt-4"
          >
            Your pattern will be reviewed by an admin before being published
          </p>

        </form>

      </div>
    </div>
  )
}

export default UploadPatternPage