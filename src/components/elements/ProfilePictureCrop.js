import React, { Component } from "react";
import Cropper from 'react-easy-crop'
import { Slider, Handles, Tracks } from 'react-compound-slider'
import getCroppedImg from './CropImage'

export default class ProfilePictureCrop extends Component {
    state = {
        //imageSrc: 'https://img.huffingtonpost.com/asset/5ab4d4ac2000007d06eb2c56.jpeg?cache=sih0jwle4e&ops=1910_1000',
        crop: { x: 0, y: 0 },
        zoom: 2,
        aspect: 4 / 4,
        //croppedImage: null,
        croppedAreaPixels: null,
        //closeModal: false
    }
    componentDidMount = () => {
        //const { idPicture } = this.props;
        //this.setState({ imageSrc: idPicture })
    }
    onCropChange = crop => {
        this.setState({ crop })
    }

    onCropComplete = (croppedArea, croppedAreaPixels) => {
        this.setState({ croppedAreaPixels: croppedAreaPixels });
    }

    onZoomChange = zoom => {
        this.setState({ zoom })
    }
    
    onChangeCroppedImage = (e) => {
        this.props.onChangeCroppedImage(e);
    }
    
    showCroppedImage = () => { 
        const { idPicture } = this.props;
        const {croppedAreaPixels, rotation } = this.state;
        if(idPicture) {
            try {             
                const croppedImage = getCroppedImg(
                    idPicture,
                    croppedAreaPixels,
                    rotation
                ).finally(()=>{
                    this.onChangeCroppedImage(croppedImage);
                });
                //console.log('donee', { croppedImage });
                
                //this.setState({ croppedImage : croppedImage });
            } catch (e) {
                console.error(e)
            } 
           
        }       
        
    }
    onClose = () => {
        //this.setState({ 
        //    croppedImage : null,
        //});  
        this.props.toggleModal(); 
    } 
    render() {
        const {showModal, idPicture} = this.props;
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
        return (
            <div className={"modal " + (showModal ? "is-active" : "")}>
                <div className="modal-background"></div>
                <div className="modal-content">
                    <div className="card">
                        <div className="card-image">
                            <figure className="image is-4by3">
                                <img src="https://bulma.io/images/placeholders/1280x960.png" alt="" />
                            </figure>
                        </div>
                        <div className="card-content">                      
                            <div className="content">
                                <Cropper
                                    image={idPicture ? idPicture : "https://img.huffingtonpost.com/asset/5ab4d4ac2000007d06eb2c56.jpeg?cache=sih0jwle4e&ops=1910_1000"}
                                    crop={this.state.crop}
                                    zoom={this.state.zoom}
                                    aspect={this.state.aspect}
                                    onCropChange={this.onCropChange}
                                    onCropComplete={this.onCropComplete}
                                    onZoomChange={this.onZoomChange}
                                />
                            </div>
                            <div className="control">
                                <Slider
                                    rootStyle={sliderStyle}
                                    domain={[1, 3]}
                                    step={0.1}
                                    values={[2].slice()}
                                    mode={1}
                                    onUpdate={this.onZoomChange}
                                    onChange={this.onChange} 
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
                            <button className="button is-success is-medium is-fullwidth" onClick={this.showCroppedImage}>
                                <span className="icon">
                                    <i className="fas fa-crop-alt"></i>
                                </span>
                                <span>Crop</span> 
                            </button>
                        </footer>
                    </div>
                        
                </div>

                    <button className="modal-close is-large" aria-label="close" onClick={this.onClose}></button>

                
            </div>     

        )
    }   
}

export function Handle({
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

  export function Track({ source, target, getTrackProps }) {
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