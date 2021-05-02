import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Slider, Handles, Tracks } from 'react-compound-slider';
import getCroppedImg from './CropImage';


const dogImg ='https://img.huffingtonpost.com/asset/5ab4d4ac2000007d06eb2c56.jpeg?cache=sih0jwle4e&ops=1910_1000'

const sliderStyle = {  // Give the slider some width
    position: 'relative',
    width: '100%',
    height: 80,
    border: '0px',
}  
const railStyle = {
    position: 'absolute',
    width: '100%',
    height: 5,
    marginTop: 35,
    borderRadius: 5,
    backgroundColor: '#d1dade',
} 

 export const IDPictureCrop = ({ history }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [rotation, setRotation] = useState(0)
    const [zoom, setZoom] = useState(2)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const [croppedImage, setCroppedImage] = useState(null)

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const showCroppedImage = useCallback(async () => {
        try {
        const croppedImage = await getCroppedImg(
            dogImg,
            croppedAreaPixels,
            rotation
        )
        //console.log('donee', { croppedImage })
        setCroppedImage(croppedImage)
        } catch (e) {
        console.error(e)
        }
    }, [croppedAreaPixels, rotation])

    const onClose = useCallback(() => {
        setCroppedImage(null);
        history.push("/registration/form/admission/9");
    }, [])

    return (
        <div className="modal is-active ">
            <div className="modal-background"></div>
            <div className="modal-content">
                <div className="card">
                    <div className="card-image">
                        <figure className="image is-4by3">
                            <img src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder image" />
                        </figure>
                    </div>
                    <div className="card-content">                      
                        <div className="content">
                            <Cropper
                                image={dogImg}
                                crop={crop}
                                rotation={rotation}
                                zoom={zoom}
                                aspect={4 / 4}
                                onCropChange={setCrop}
                                onRotationChange={setRotation}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                            />
                        </div>
                        <div className="control">
                            <Slider
                                rootStyle={sliderStyle}
                                domain={[1, 3]}
                                step={0.1}
                                values={[2].slice()}
                                mode={1}
                                onUpdate={setZoom}
                                //onChange={this.onChange} 
                            >
                                <div style={railStyle} />
                                <Handles>
                                    {({ handles, getHandleProps }) => (
                                        <div className="slider-handles">
                                        {handles.map(handle => (
                                            <Handle
                                                key={handle.id}
                                                handle={handle}                            
                                                getHandleProps={getHandleProps}
                                            />
                                        ))}
                                        </div>
                                    )}
                                </Handles>
                                <Tracks right={false}>
                                    {({ tracks, getTrackProps }) => (
                                        <div className="slider-tracks">
                                        {tracks.map(({ id, source, target }) => (
                                            <Track
                                                key={id}
                                                source={source}
                                                target={target}
                                                getTrackProps={getTrackProps}
                                            />
                                        ))}
                                        </div>
                                    )}
                                </Tracks>
                            </Slider>
                        </div>
                    </div>
                    <footer className="card-footer">
                        <button className="button is-success is-medium is-fullwidth" onClick={showCroppedImage}>
                            <span className="icon">
                                <i className="fas fa-crop-alt"></i>
                            </span>
                            <span>Crop</span> 
                        </button>
                    </footer>
                </div>
                    
            </div>
  
                <button className="modal-close is-large" aria-label="close" onClick={onClose}></button>

            
        </div> 
    )
}

function Handle({
    handle: { id, value, percent },
    getHandleProps
  }) {
    return (
      <div
        style={{
          left: `${percent}%`,
          position: 'absolute',
          marginLeft: -15,
          marginTop: 28,
          zIndex: 2,
          width: 20,
          height: 20,
          border: '2px solid #f5f9ff',
          textAlign: 'center',
          cursor: 'pointer',
          borderRadius: '50%',
          backgroundColor: '#273d5c',
          color: '#333',
        }}
        {...getHandleProps(id)}
      >
        <div style={{ fontFamily: 'Roboto', fontSize: 11, marginTop: -35 }}>
          {/*value*/}
        </div>
      </div>
    )
  }

function Track({ source, target, getTrackProps }) {
    return (
      <div
        style={{
          position: 'absolute',
          height: 5,
          zIndex: 1,
          marginTop: 35,
          backgroundColor: '#70d2ff',
          borderRadius: 5,
          cursor: 'pointer',
          left: `${source.percent}%`,
          width: `${target.percent - source.percent}%`,
        }}
        {...getTrackProps() /* this will set up events if you want it to be clickeable (optional) */}
      />
    )
}

