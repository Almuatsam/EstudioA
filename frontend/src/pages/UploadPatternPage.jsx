import LoadingSpinner from '../components/LoadingSpinner'
import Button from '../components/Button'
import Input from '../components/Input'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { patternsAPI, uploadAPI } from '../services/api'
import './UploadPatternPage.css'

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
      
      setUploadProgress('Uploading PDF file...')
      const pdfResponse = await uploadAPI.uploadPatternFile(files.pdfFile)
      
      setUploadProgress('Uploading preview image...')
      const imageResponse = await uploadAPI.uploadPatternImage(files.imageFile)
      
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
      
      await patternsAPI.createPattern(patternData)
      
      setUploadProgress('Success!')
      alert('Pattern uploaded successfully! It will be reviewed by an admin.')
      navigate('/designer-dashboard')
      
    } catch (error) {
      console.error('Upload failed:', error)
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
    <div className="upload-page">
      <div className="upload-container">
        
        <div className="upload-header">
          <h1 className="display-2">Upload Pattern</h1>
          <p className="body-large text-secondary">Share your sewing pattern with the community</p>
        </div>

        <form onSubmit={handleSubmit}>
          
          {/* Pattern Details */}
          <div className="upload-section">
            <h2 className="h2 mb-6">Pattern Details</h2>

            <div className="upload-form-grid">
              <Input
                label="Pattern Title"
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Summer Maxi Dress"
              />

              <Input
                label="Designer Name"
                type="text"
                name="designer_name"
                required
                value={formData.designer_name}
                onChange={handleInputChange}
                placeholder="Your name or studio name"
              />
            </div>

            <Input
              label="Description"
              type="text"
              name="description"
              required
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your pattern, including details about fit, fabric recommendations..."
            />

            <div className="upload-form-grid">
              <div className="input-container">
                <label className="input-label">Category *</label>
                <select
                  name="category_id"
                  required
                  value={formData.category_id}
                  onChange={handleInputChange}
                  className="input"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-container">
                <label className="input-label">Difficulty Level *</label>
                <select
                  name="difficulty_id"
                  required
                  value={formData.difficulty_id}
                  onChange={handleInputChange}
                  className="input"
                >
                  <option value="">Select difficulty level</option>
                  {difficulties.map((diff) => (
                    <option key={diff.id} value={diff.id}>
                      {diff.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Input
              label="Tags (comma-separated)"
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="e.g., summer, casual, cotton, beginner-friendly"
              helperText="Separate tags with commas"
            />

          </div>

          {/* File Uploads */}
          <div className="upload-section">
            <h2 className="h2 mb-6">Files</h2>

            <div className="upload-file-group">
              <label className="input-label">Pattern PDF File *</label>
              <input
                type="file"
                name="pdfFile"
                accept=".pdf"
                required
                onChange={handleFileChange}
                className="upload-file-input"
              />
              <p className="upload-file-helper">Upload your pattern as a PDF file</p>
              {files.pdfFile && (
                <p className="upload-file-selected">Selected: {files.pdfFile.name}</p>
              )}
            </div>

            <div className="upload-file-group">
              <label className="input-label">Preview Image *</label>
              <input
                type="file"
                name="imageFile"
                accept="image/png, image/jpeg, image/jpg, image/gif"
                required
                onChange={handleFileChange}
                className="upload-file-input"
              />
              <p className="upload-file-helper">Upload a preview image (PNG, JPG, or GIF)</p>
              {files.imageFile && (
                <p className="upload-file-selected">Selected: {files.imageFile.name}</p>
              )}
            </div>

          </div>

          {/* Upload Progress */}
          {uploadProgress && (
            <div className="upload-progress">
              <LoadingSpinner size="medium" text={uploadProgress} />
            </div>
          )}

          {/* Submit Buttons */}
          <div className="upload-actions">
            <Button
              type="submit"
              variant="primary"
              size="large"
              loading={loading}
              className="upload-submit"
            >
              {loading ? 'Uploading...' : 'Submit Pattern'}
            </Button>
            
            <Button
              type="button"
              variant="secondary"
              size="large"
              onClick={() => navigate('/designer-dashboard')}
            >
              Cancel
            </Button>
          </div>

          <p className="upload-notice">
            Your pattern will be reviewed by an admin before being published
          </p>

        </form>

      </div>
    </div>
  )
}

export default UploadPatternPage