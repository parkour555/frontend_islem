import {Button, Col, FormGroup, Label, Row} from "reactstrap";
import {AvField, AvForm} from "availity-reactstrap-validation";
import Select from "react-select";
import React, {useState} from "react";

import {withRouter} from "react-router-dom";
import ProductService from "../../api/ProductService";
import ImageCropper from "../ImageCropper";
import {dataURLtoFile} from "../../utlis/functions";
import {useAlert} from 'react-alert'

const AddProduct = (props) => {
    const alert = useAlert()
    const [blob, setBlob] = useState(null)
    const [inputImg, setInputImg] = useState('')
    const [cropend, setCropend] = useState(true)
    const [errors, setErrors] = useState([])

    const getBlob = (blob) => {
        setBlob(blob)
    }


    const onInputChange = (e) => {
        // convert image file to base64 string
        const file = e.target.files[0]
        const reader = new FileReader()

        reader.addEventListener('load', () => {
            setInputImg(reader.result)
        }, false)

        if (file) {
            reader.readAsDataURL(file)
        }
        setCropend(false)
    }

    const handleSubmitImage = (e) => {
        setCropend(true)

    }
    const RemoveImage = (e) => {
        setCropend(true)
        setBlob(null)
        setInputImg('')

    }
    const [selectedMultiTypeProduct, setselectedMultiTypeProduct] = useState(props.data ? {
        label: props.data.type,
        value: props.data.type
    } : null)

    function handleSelectedMultiTypeProduct(type) {
        setselectedMultiTypeProduct(type)
    }

    const optionGroup1 = [
        {
            label: "Type De materiel",
            options: [
                {label: "PC", value: "PC"},
                {label: "Smartphone", value: "Smartphone"},
                {label: "Tablette", value: "Tablette"},
                {label: "Ipade", value: "Ipade"},
                {label: "périphérique sortie ", value: "périphérique sortie"},
                {label: "périphérique d'entrée ", value: "périphérique d'entrée"},
            ]
        },
    ]

    async function addProductAction(event, values) {
        if (handleValidation()) {

            var image = null
            if (blob) {
                let data = new FormData();
                var file = dataURLtoFile(blob, 'image.jpeg');
                data.append('image', file);
                const response = await ProductService.uploadImage(data)
                if (response.status === 200) {
                    image = response.data.image
                }
            }
            if (props.data) {
                try {
                    values.id = props.data.id
                    values.image = image ? image : props.data.image
                    values.type = selectedMultiTypeProduct.value
                    const response = await ProductService.UpdateProduct(values)
                    if (response.status === 200) {
                        props.onRefresh()
                        alert.success('Matériel a été modifier avec succés')


                    }

                } catch (e) {
                    alert.error('Erreur modification')

                }
            } else {
                try {

                    values.type = selectedMultiTypeProduct.value
                    values.image = image ? image : null
                    const response = await ProductService.addproduct(values)
                    if (response.status === 200) {
                        props.onRefresh()

                        alert.success(' Matériel a été ajouter avec succés ')
                    }

                } catch (e) {
                    alert.error('Erreur Matériel')

                }
            }
        }
    }

    function handleValidation() {
        let errors = [];
        let formIsValid = true;

        if (!selectedMultiTypeProduct) {
            formIsValid = false;
            errors["selectedMultiTypeProduct"] = "SVP Entrez le type de produit";
        }


        setErrors(errors);
        return formIsValid;
    }

    return (
        <AvForm className="needs-validation"
                onValidSubmit={(e, v) => {
                    addProductAction(e, v)
                }}
        >
            <div className="container">


                {
                    !cropend && inputImg && (
                        <ImageCropper
                            getBlob={getBlob}
                            inputImg={inputImg}
                        />
                    )
                }
                <center>
                    {blob && cropend && (
                        <div>
                            <img className="file-upload-image" src={blob} alt="your image"/>
                            <div class="image-title-wrap">
                                <button type="button" onClick={() => RemoveImage()} className="btn btn-danger">Remove <i
                                    className="mdi mdi-cancel"/></button>
                            </div>
                        </div>
                    )}
                </center>
                <center>
                    {cropend && !inputImg && (
                        <div class="file-upload">
                            <div>
                                <div className="image-upload-wrap">
                                    <input className="file-upload-input" type="file" accept="image/*"
                                           onChange={onInputChange}/>
                                    <div className="drag-text">
                                        <h3>Faites glisser et déposez un fichier ou sélectionnez ajouter une image </h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </center>
                {!cropend && (
                    <div className={"row pt-3"}>
                        <div className={"col-8"}>

                        </div>
                        <div className="col-2">
                            <button className="btn btn-danger w-md waves-effect waves-light"
                                    type="submit"
                                    onClick={RemoveImage}>
                                Cancel <i className="mdi mdi-cancel"/>
                            </button>
                        </div>
                        <div className="col-2">
                            <button className="btn btn-primary w-md waves-effect waves-light"
                                    type="submit"
                                    onClick={handleSubmitImage}>
                                Crop <i className="mdi mdi-crop"/>
                            </button>
                        </div>
                    </div>
                )
                }


            </div>

            <Row>
                <Col md="6">
                    <div className="mb-3">
                        <Label htmlFor="validationCustom01">Nom</Label>
                        <AvField
                            name="nom"
                            placeholder="Nom"
                            type="text"
                            value={props.data ? props.data.nom : null}
                            errorMessage=" SVP Entrez le nom"
                            className="form-control"
                            validate={{required: {value: true}}}
                            id="validationCustom01"
                        />
                    </div>
                </Col>
                <Col md="6">
                    <div className="mb-3">
                        <Label htmlFor="validationCustom01">Modèle</Label>
                        <AvField
                            name="modele"
                            placeholder="modele"
                            type="text"
                            value={props.data ? props.data.modele : null}
                            errorMessage=" SVP Entrez le Modèle"
                            className="form-control"
                            validate={{required: {value: true}}}
                            id="validationCustom01"
                        />
                    </div>
                </Col>

            </Row>

            <Row>
                <Col md="6">
                    <div className="mb-3 templating-select select2-container">
                        <label className="control-label">type</label>
                        <Select
                            placeholder="type"
                            value={selectedMultiTypeProduct}
                            onChange={(e) => {
                                handleSelectedMultiTypeProduct(e)
                            }}
                            options={optionGroup1}
                            classNamePrefix="select2-selection"
                            closeMenuOnSelect={false}
                        />
                        <span className="text-danger">{errors['selectedMultiTypeProduct']}</span>

                    </div>

                </Col>
                <Col md="6">
                    <div className="mb-3">
                        <Label htmlFor="validationCustom01">Prix</Label>
                        <AvField
                            name="prix"
                            placeholder="Prix"
                            type="text"
                            value={props.data ? props.data.prix : null}
                            errorMessage=" SVP Entrez le Prix"
                            className="form-control"
                            validate={{required: {value: true}}}
                            id="validationCustom01"
                        />
                    </div>
                </Col>

            </Row>


            <Col md="50">

                <FormGroup className="mb-0">
                    <div>
                        <Button type="submit" color="primary" className="ms-1">
                            {props.data ? "Mise a jour" : "Ajouter"}
                        </Button>
                        <Button type="reset" color="secondary" href="/Product">
                            Annuler
                        </Button>
                    </div>
                </FormGroup>
            </Col>

        </AvForm>
    )


}

export default withRouter(AddProduct)
