"use client";

import React, { useState, useEffect, useRef } from "react";
import { getLoggedInUserDetails } from "../apicalls/users";
import NavigationBar from "../NavigationBar/navigation.js";
import "./generator.css";
import axios from "axios";

const baseApiUrl = process.env.NEXT_PUBLIC_REACT_APP_BASE_API_URL;

const BACKGROUND_COLORS = {
  white: { value: 'white', hex: '#FFFFFF', label: 'White' },
  blue: { value: 'blue', hex: '#628BCE', label: 'Blue' },
  red: { value: 'red', hex: '#D74532', label: 'Red' },
  black: { value: 'black', hex: '#000000', label: 'Black' },
  darkblue: { value: 'darkblue', hex: '#4B6190', label: 'Dark Blue' },
  lightgrey: { value: 'lightgrey', hex: '#F2F0F0', label: 'Light Grey' },
} as const;

const RENDER_MODES = [
  { value: 'solid', label: 'Solid Color', mode: 0 },
  { value: 'updown', label: 'Up-Down Gradient (White)', mode: 1 },
  { value: 'center', label: 'Center Gradient (White)', mode: 2 },
] as const;

const SIZE_TYPES = ['preset list', 'only change background', 'custom (pixels)'] as const;

const PRESET_SIZES = [
  { value: 'driver_license', label: 'Driver\'s License', width: 600, height: 600 },
  { value: 'us_passport', label: 'US Passport', width: 600, height: 600 },
  { value: 'ead', label: 'Employment Authorization Document', width: 600, height: 600 },
  { value: 'greencard', label: 'Permanent Resident Card', width: 600, height: 600 },
  { value: 'concealed_carry_permit', label: 'Concealed Carry Permit', width: 300, height: 300 },
  { value: 'us_visa', label: 'American Visa', width: 600, height: 600 },
  { value: 'jp_visa', label: 'Japanese Visa', width: 600, height: 600 },
  { value: 'ca_visa', label: 'Canadian Visa', width: 420, height: 540 },
  { value: 'one_inch', label: 'One Inch', width: 295, height: 413 },
] as const;

type SizeType = (typeof SIZE_TYPES)[number];
type BackgroundColor = (typeof BACKGROUND_COLORS)[keyof typeof BACKGROUND_COLORS]['hex'];
type RenderMode = (typeof RENDER_MODES)[number]['mode'];
type PresetSize = (typeof PRESET_SIZES)[number]['value'];

type ParamValue = string | number | null | BackgroundColor | RenderMode | PresetSize | SizeType;

interface GeneratorParams {
  face_detect_model: string;
  human_matting_model: string;
  presetSize: PresetSize;
  backgroundColor: BackgroundColor;
  renderMode: RenderMode;
  sizeType: SizeType;
  height?: number;
  width?: number;
}

interface MinimalUserData {
  _id: string;
  firstName: string;
}

export default function GeneratorPage() {

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [params, setParams] = useState<GeneratorParams>({
    face_detect_model: 'mtcnn',
    human_matting_model: 'modnet_photographic_portrait_matting',
    presetSize: 'driver_license',
    backgroundColor: '#FFFFFF',
    renderMode: 0,
    sizeType: 'preset list',
    width: 600,
    height: 600,
  });

  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [processingError, setProcessingError] = useState<string | null>(null);

  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [customColor, setCustomColor] = useState('');
  const [showCustomColorInput, setShowCustomColorInput] = useState(false);

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [userData, setUserData] = useState<MinimalUserData | null>(null);
  const [currentDate, setCurrentDate] = useState("");
  
  useEffect(() => {
    // Load user data
    loadUserData();

    // Set the current date
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short' as const, 
      day: 'numeric' as const, 
      month: 'long' as const, 
      year: 'numeric' as const 
    };
    setCurrentDate(today.toLocaleDateString("en-US", options));

    // Load example images
    const imgUrls = Array.from({ length: 10 }).map((_, index) => `/images/exampleImage/test${index + 1}.jpg`);
    
    Promise.all(
      imgUrls.map((url) =>
        new Promise((resolve) => {
          const img = new Image();
          img.src = url;
          img.onload = () => resolve(url);
          img.onerror = () => resolve(null);
        })
      )
    ).then((results) => {
      setExistingImages(results.filter((url) => url !== null) as string[]);
    });
  }, []);

  const loadUserData = async () => {
    try {
      const userResponse = await getLoggedInUserDetails();
      setUserData(userResponse.data);
    } catch (error) {
      console.error("Error loading user data for generator:", error);
    }
  }

  const handleFile = (file: File) => {
    const MAX_SIZE = 150 * 1024; // 150KB in bytes
    
    if (file.size > MAX_SIZE) {
      alert("File size must be less than 150KB");
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      alert("Please upload an image file");
      return;
    }
    
    setSelectedImage(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleParamChange = (key: keyof GeneratorParams, value: ParamValue) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const handleGenerate = async () => {
    setProcessedImage(null);
    setProcessingError(null);
    
    if (!selectedImage) {
      alert('Please upload an image first');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', selectedImage);
      formData.append('params', JSON.stringify(params));
      formData.append('user_id', userData?._id || '');

      const response = await axios.post(`${baseApiUrl}/photo/process`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      });

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      setProcessedImage(response.data.data.image_base64);
      
    } catch (error) {
      console.error('Error generating photo:', error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setProcessingError(`Server error: ${error.response.data?.message || error.message}`);
        } else if (error.request) {
          setProcessingError('No response from server. Please check your connection.');
        } else {
          setProcessingError(`Request error: ${error.message}`);
        }
      } else {
        setProcessingError('An unexpected error occurred');
      }
      alert('Failed to generate photo. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="generatorContainer">
      <NavigationBar />

      {/* <div className="" style={{backgroundColor: "#f1f4f7"}}> */}
        {/* <div className="w-full"> */}
          <main className="mainContent">
            {/* Header */}
            <div className="topSection">
              <h1 className="welcomeMessage">Welcome, {userData?.firstName}</h1>
              <p className="date">{currentDate}</p>
            </div>

            {/* Middle Section */}
            <div className="middleSection">
              <div className="colorBar"></div>
              {/* Main content grid - Image Upload and Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 mt-4 mx-2 gap-2">
                {/* Left panel - Image Upload */}
                <div 
                  className={`border-2 border-dashed rounded-lg p-8 ${
                    dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={handleClick}
                  style={{ cursor: 'pointer' }}
                >
                  <input
                    data-testid="file-input"
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleChange}
                  />
                  <div className="flex flex-col items-center justify-center h-64">
                    {selectedImage ? (
                      <img
                        src={URL.createObjectURL(selectedImage)}
                        alt="Selected"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <>
                        <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm text-gray-500">Drop Image Here</p>
                        <p className="text-sm text-gray-500 mt-2">-or-</p>
                        <p className="text-sm text-gray-500">Click to Upload</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Right panel - Preview */}
                <div className="border-2 border-gray-300 rounded-lg p-8">
                  <div className="flex items-center justify-center h-64">
                    {isLoading ? (
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        <p className="mt-4 text-gray-500">Processing image...</p>
                      </div>
                    ) : processedImage ? (
                      <img
                        src={processedImage}
                        alt="Processed"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : processingError ? (
                      <div className="flex flex-col items-center text-red-500">
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                        <p className="mt-4 text-sm text-center">{processingError}</p>
                      </div>
                    ) : (
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </div>

              {/* Controls and Examples Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 my-2 mx-2 gap-2">
                {/* Left Side - Controls */}
                <div className="space-y-4">

                  {/* Parameters setting */}
                  <div className="border rounded-lg p-3">
                    {/* Size Selection */}
                    <div className="space-y-2">
                      <label className="text-sm text-gray-600">ID Photo Size Selection</label>
                      <div className="flex gap-4">
                      {SIZE_TYPES.map((type) => (
                        <label key={type} className="flex items-center">
                          <input 
                            type="radio" 
                            name="sizeType"
                            value={type}
                            checked={params.sizeType === type}
                            onChange={(e) => {
                              const newType = e.target.value as SizeType;
                              handleParamChange('sizeType', newType);
                              
                              // Set dimensions to null if "only change background" is selected
                              if (newType === 'only change background') {
                                handleParamChange('width', null);
                                handleParamChange('height', null);
                              } else if (newType === 'preset list' || newType === 'custom (pixels)') {
                                // Reset to default preset dimensions when switching to preset list
                                const defaultPreset = PRESET_SIZES.find(size => size.value === params.presetSize);
                                if (defaultPreset) {
                                  handleParamChange('width', defaultPreset.width);
                                  handleParamChange('height', defaultPreset.height);
                                }
                              }
                            }}
                            className="mr-2" 
                          />
                          <span className="capitalize">{type}</span>
                        </label>
                        ))}
                      </div>
                    </div>

                    {/* Custom size based on sizeType */}
                    {params.sizeType === 'preset list' && (
                      <div className="space-y-2 mt-2">
                        <label className="text-sm text-gray-600">Preset Size</label>
                        <select 
                          className="w-full p-2 border rounded-lg bg-white"
                          value={params.presetSize}
                          onChange={(e) => {
                            const selectedPreset = PRESET_SIZES.find(size => size.value === e.target.value);
                            handleParamChange('presetSize', e.target.value);
                            if (selectedPreset) {
                              handleParamChange('width', selectedPreset.width);
                              handleParamChange('height', selectedPreset.height);
                            }
                          }}
                        >
                          {PRESET_SIZES.map((size) => (
                            <option key={size.value} value={size.value}>
                              {size.label} ({size.width}*{size.height}px)
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {params.sizeType === 'custom (pixels)' && (
                      <div className="mt-2 grid grid-cols-2 gap-6 flex">
                        <div className="flex flex-col">
                          <label className="text-sm text-gray-600">Width (px)</label>
                          <input
                            type="number"
                            className="w-full p-2 border rounded-lg"
                            value={params.width || 600}
                            onChange={(e) => handleParamChange('width', parseInt(e.target.value, 10))}
                            min="1"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm text-gray-600">Height (px)</label>
                          <input
                            type="number"
                            className="w-full p-2 border rounded-lg"
                            value={params.height || 600}
                            onChange={(e) => handleParamChange('height', parseInt(e.target.value, 10))}
                            min="1"   
                          />
                        </div>
                      </div>
                    )}  
                    <hr className="my-4 border-gray-200" />

                    {/* Background Color */}
                    <div className="space-y-2 mt-5">
                      <label className="text-sm text-gray-600">Background Color</label>
                      <div className="flex flex-wrap gap-x-4 gap-y-2">
                        {Object.values(BACKGROUND_COLORS).map((color) => (
                          <label key={color.value} className="flex items-center min-w-[100px]">
                            <input 
                              type="radio" 
                              name="backgroundColor"
                              value={color.hex}
                              checked={!showCustomColorInput && params.backgroundColor === color.hex}
                              onChange={(e) => {
                                setShowCustomColorInput(false);
                                handleParamChange('backgroundColor', e.target.value);
                              }}
                              className="mr-2" 
                            />
                            <span className="capitalize">{color.label}</span>
                          </label>
                        ))}
                        <label className="flex items-center min-w-[100px]">
                          <input
                            type="radio"
                            name="backgroundColor"
                            checked={showCustomColorInput}
                            onChange={() => setShowCustomColorInput(true)}
                            className="mr-2"
                          />
                          <span>Other (HEX)</span>
                        </label>
                      </div>
                      {showCustomColorInput && (
                        <div className="mt-2">
                          <input
                            type="text"
                            placeholder={params.backgroundColor}
                            value={customColor}
                            onChange={(e) => {
                              const newValue = e.target.value;
                              setCustomColor(newValue);
                              if (/^#[0-9A-F]{6}$/i.test(newValue)) {
                                handleParamChange('backgroundColor', newValue);
                              }
                            }}
                            className={`p-2 border rounded-lg w-full ${
                              customColor && !/^#[0-9A-F]{6}$/i.test(customColor)
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-300'
                            }`}
                          />
                          {customColor && !/^#[0-9A-F]{6}$/i.test(customColor) && (
                            <p className="text-red-500 text-sm mt-1">
                              Please enter a valid hex color (e.g., #FF0000)
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Render Mode */}
                    <div className="space-y-2 mt-6">
                      <label className="text-sm text-gray-600">Render mode</label>
                      <div className="flex flex-wrap gap-x-4 gap-y-2">
                        {RENDER_MODES.map((rmode) => (
                          <label key={rmode.value} className="flex items-center min-w-[150px]">
                            <input 
                              type="radio" 
                              name="renderMode" 
                              value={rmode.mode} 
                              checked={params.renderMode === rmode.mode} 
                              onChange={(e) => handleParamChange('renderMode', parseInt(e.target.value, 10))} 
                              className="mr-2" 
                            />
                            <span>{rmode.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                  >
                    <span>{showAdvancedSettings ? 'Hide' : 'Show'} Advanced Model Settings</span>
                    <i className={`fas fa-chevron-${showAdvancedSettings ? 'up' : 'down'}`}></i>
                  </button>

                  {showAdvancedSettings && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm text-gray-600">Face Detection Model</label>
                        <select 
                          className="w-full p-2 border rounded-lg bg-white"
                          value={params.face_detect_model}
                          onChange={(e) => handleParamChange('face_detect_model', e.target.value)}
                        >
                          <option value="mtcnn">mtcnn (Default)</option>
                          <option value="retinaface-resnet50">retinaface-resnet50 (High Accuracy)</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-600">Matting Models</label>
                        <select 
                          className="w-full p-2 border rounded-lg bg-white"
                          value={params.human_matting_model}
                          onChange={(e) => handleParamChange('human_matting_model', e.target.value)}
                        >
                          <option value="modnet_photographic_portrait_matting">modnet PP matting (Default)</option>
                          <option value="birefnet-v1-lite">birefnet-v1-lite (High Accuracy, Slow, GPU acceleration)</option>
                          <option value="hivision_modnet">hivision_modnet</option>
                          <option value="rmbg-1.4">rmbg-1.4</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Generate Button */}
                  <button 
                    className={`w-full py-3 rounded-lg transition-colors ${
                      selectedImage && !isLoading && !(customColor && !/^#[0-9A-F]{6}$/i.test(customColor))
                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                        : 'bg-gray-300 cursor-not-allowed text-gray-500'
                    }`}
                    onClick={handleGenerate}
                    disabled={!selectedImage || isLoading}
                  >
                    {isLoading ? 'Generating...' : 'Generate'}
                  </button>
                </div>

                {/* Right Side - Examples */}
                <div className="border rounded-lg p-4">
                  <div className="mb-2">
                    <h2 className="text-lg font-semibold text-gray-700">Examples</h2>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {existingImages.map((imgUrl, index) => (
                      <div 
                        key={index} 
                        className="p-1 cursor-pointer hover:border-blue-500 transition-all transform hover:-translate-y-1 duration-200"
                        onClick={async () => {
                          try {
                            const response = await fetch(imgUrl);
                            const blob = await response.blob();
                            const file = new File([blob], `example-${index + 1}.jpg`, { type: 'image/jpeg' });
                            setSelectedImage(file);
                          } catch (error) {
                            console.error('Error loading example image:', error);
                            alert('Failed to load example image');
                          }
                        }}
                      >
                        <img
                          src={imgUrl}
                          alt={`Example ID Photo ${index + 1}`}
                          className="w-full h-auto object-cover aspect-[3/4] rounded-lg shadow-sm hover:shadow-md transition-shadow"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
                      
            </div>

          </main>
        {/* </div> */}
      {/* </div> */}

    </div>
  );
}