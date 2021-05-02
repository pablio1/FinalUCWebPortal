import React, { Component, Fragment } from 'react';
import SelectProvince from '../../../elements/SelectProvince'
import SelectCity from '../../../elements/SelectCity'
import { sortArrayObjectsByProp, deleteArrayObjectsProp, stringFindAndReplace } from '../../../../helpers/helper';
import axios from 'axios';

export default class AddressAndContactsPermanent extends Component {
    state = {
        cities: null, isProvinceSelected: false
    }
    componentDidMount = () => {
        const province = (this.props.values.provincePermanentAddCode) ? this.props.values.provincePermanentAddCode : "";
        this.getCities(province);
    }
    handleOnChangeInput = e => {
        if(e.target.name === "provincePermanentAdd") {
            const optionText =  e.target.options[e.target.selectedIndex].text;   
            this.props.handleOnChangeInput(e.target.name, optionText);
            this.props.handleOnChangeInput(e.target.name + "Code", e.target.value);
            this.props.handleOnChangeInput("cityPermanentAdd", "");
            this.getCities(e.target.value);
        }
        else {
          this.props.handleOnChangeInput(e.target.name, e.target.value);
        }
    }
    toggleIsProvinceSelected = () => {
        const {isProvinceSelected} = this.state;
        this.setState({ isProvinceSelected : !isProvinceSelected });
    }
    handleCheckBoxChange = e => {        
        this.props.handleCheckBoxChange(e);
        // Empty all Permanent Address Values if same as current checkbox is ticked
        if(e.target.checked) {
            const { values } = this.props;  
            this.props.handleOnChangeInput("zipcodePermanentAdd", values.zipcodeCurrentAdd);            
            this.props.handleOnChangeInput("provincePermanentAddCode", values.provinceCurrentAddCode);   
            this.props.handleOnChangeInput("provincePermanentAdd", values.provinceCurrentAdd); 
            this.props.handleOnChangeInput("cityPermanentAdd", values.cityCurrentAdd);   
            this.props.handleOnChangeInput("barangayPermanentAdd", values.barangayCurrentAdd);   
            this.props.handleOnChangeInput("streetPermanentAdd", values.streetCurrentAdd);   
        }
    }  
    getCities = province => {        
        if(province) {
            this.toggleIsProvinceSelected();
            const apiResourceCities = stringFindAndReplace(process.env.REACT_APP_API_PH_PROVINCE_CITIES, "<provinceCode>", province);
            const apiResourceMunicipalities = stringFindAndReplace(process.env.REACT_APP_API_PH_PROVINCE_MUNICIPALITIES, "<provinceCode>", province);

            const apiRequest1 = axios.get(apiResourceCities);
            const apiRequest2 = axios.get(apiResourceMunicipalities);
            Promise.all([apiRequest1, apiRequest2]).then(values =>  {
                let citiesArr = [];
                let municipalitiesArr = [];
                if(values[0].data && values[1].data) { 
                    citiesArr = deleteArrayObjectsProp(values[0].data, "isCapital"); //remove isCapital prop in cities object 
                    municipalitiesArr = values[1].data;
                    Array.prototype.push.apply(citiesArr,municipalitiesArr); //merge municipalities to cities                     
                }
                if(!values[0].data && values[1].data) citiesArr = values[1].data;
                if(values[0].data && !values[1].data) citiesArr = values[0].data;
                this.setState({  
                    cities: sortArrayObjectsByProp(citiesArr, "name"),
                });
                this.toggleIsProvinceSelected();  
            }).catch(error => {
                console.log(error);
            });

            /* DEPRECEATED
            axios.all([
                axios.get(apiResourceCities),
                axios.get(apiResourceMunicipalities)
            ])
            .then(axios.spread((cities, municipalities) => {
                let citiesArr = [];
                let municipalitiesArr = [];
                if(cities.data && municipalities.data) { 
                    citiesArr = deleteArrayObjectsProp(cities.data, "isCapital"); //remove isCapital prop in cities object 
                    municipalitiesArr = municipalities.data;
                    Array.prototype.push.apply(citiesArr,municipalitiesArr); //merge municipalities to cities                     
                }
                if(!cities.data && municipalities.data) citiesArr = municipalities.data;
                if(cities.data && !municipalities.data) citiesArr = cities.data;
                this.setState({  
                    cities: sortArrayObjectsByProp(citiesArr, "name"),
                });
                this.toggleIsProvinceSelected();
            })).catch(error => {
                console.log(error);
            }); */
        }
    } 
    render() { 
        const { values } = this.props;  
        const { cities, isProvinceSelected } = this.state;
        //const zipCode = values.isSameAsCurrentAdd ? values.zipcodeCurrentAdd : values.zipcodePermanentAdd;
        //const province = values.isSameAsCurrentAdd ? values.provinceCurrentAddCode : values.provincePermanentAddCode;
        //const city = values.isSameAsCurrentAdd ? values.cityCurrentAdd : values.cityPermanentAdd;
        //const barangay = values.isSameAsCurrentAdd ? values.barangayCurrentAdd : values.barangayPermanentAdd;
        //const street = values.isSameAsCurrentAdd ? values.streetCurrentAdd : values.streetPermanentAdd;
        const permanentAddressForm = !values.isSameAsCurrentAdd ? (
            <Fragment>
                <div className="columns is-vcentered">
                    <div className="column is-1 is-hidden-mobile"></div>
                    <div className="column is-2">                                             
                        <h5 className="has-text-weight-bold mb-2">Zip Code</h5>
                        <div className="field">
                            <div className="control has-icons-left has-icons-right">                                                    
                                <input name="zipcodePermanentAdd" className="input" type="text" placeholder="Zip Code" 
                                       onChange={this.handleOnChangeInput} value={values.zipcodePermanentAdd} data-fieldname="Permanent Address Zip Code"/>
                                <span className="icon is-small is-left">
                                    <i className="fas fa-barcode"></i>
                                </span>
                            </div>
                        </div>                                                                                                                                                                                                                                                                    
                    </div>      
                    <div className="column">                                                
                        <h5 className="has-text-weight-bold mb-2"><i className="fas fa-exclamation-circle has-text-info"></i> Province</h5>
                        <div className="field">
                            <div className="control is-expanded">                           
                                <SelectProvince 
                                    name="provincePermanentAdd"
                                    value={values.provincePermanentAddCode}
                                    required={true}
                                    fieldname="Permanent Address Province"
                                    handleOnChangeInput={this.handleOnChangeInput}
                                />                                   
                            </div>
                        </div>                                                                                                                                                                                                                                                                
                    </div>  
                    <div className="column"> 
                        <h5 className="has-text-weight-bold mb-2"><i className="fas fa-exclamation-circle has-text-info"></i> City / Municipality</h5>
                        <div className="field">
                            <div className="control is-expanded">
                                <SelectCity
                                    name="cityPermanentAdd"
                                    province={values.provincePermanentAddCode}
                                    cities={cities}
                                    value={values.cityPermanentAdd}
                                    required={true}
                                    fieldname="Permanent Address City / Municipality"
                                    handleOnChangeInput={this.handleOnChangeInput}   
                                    isProvinceSelected={isProvinceSelected}                 
                                />
                            </div>
                        </div>                                                                                                                                                                                                                                                                    
                    </div>
                    <div className="column"> 
                        <h5 className="has-text-weight-bold mb-2">Barangay</h5>
                        <div className="field">
                            <div className="control has-icons-left has-icons-right">                                                    
                                <input name="barangayPermanentAdd" className="input" type="text" placeholder="Barangay" 
                                       onChange={this.handleOnChangeInput} value={values.barangayPermanentAdd} data-fieldname="Permanent Barangay"/>
                                <span className="icon is-small is-left">
                                    <i className="fas fa-monument"></i>
                                </span>
                            </div>
                        </div>                                                                                                                                                                                                                                                                  
                    </div>      
                    <div className="column is-1 is-hidden-mobile"></div>                                           
                </div>
                <div className="columns is-vcentered">
                    <div className="column is-1 is-hidden-mobile"></div>                                            
                    <div className="column"> 
                        <h5 className="has-text-weight-bold mb-2"><i className="fas fa-exclamation-circle has-text-info"></i> Street Address</h5>
                        <div className="field">
                            <div className="control has-icons-left has-icons-right">                                                    
                                <input name="streetPermanentAdd" className="input" type="text" placeholder="House #, Street, Subdiv/Village, Sitio" 
                                       onChange={this.handleOnChangeInput} value={values.streetPermanentAdd} required data-fieldname="Permanent Address Street"/>
                                <span className="icon is-small is-left">
                                    <i className="fas fa-home"></i>
                                </span>
                            </div>
                        </div>                                                                                                                                                                                                                                                                    
                    </div>                                              
                    <div className="column is-1 is-hidden-mobile"></div>                                           
                </div>
            </Fragment>
        ) : "";

        return(
            <Fragment>
                <div className="columns is-vcentered mt-0 pt-0">
                    <div className="column is-1 is-hidden-mobile"></div>
                    <div className="column">
                        <h3 className="has-text-weight-bold is-size-5 mb-0 pb-0">Permanent / Provincial Address</h3>
                        <label className="checkbox">
                            <input type="checkbox" name="isSameAsCurrentAdd" checked={values.isSameAsCurrentAdd} onChange={this.handleCheckBoxChange} />
                            &nbsp;Same as Current Address
                        </label>
                    </div>
                </div>
                {permanentAddressForm} 
            </Fragment>    
        );
    }

}