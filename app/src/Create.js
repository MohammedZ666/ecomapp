import { useState, useRef } from "react";
import { useHistory } from "react-router-dom"
import { Input } from '@material-ui/core';
import Image from 'material-ui-image';
import Carousel from 'react-material-ui-carousel'
import ChipInput from 'material-ui-chip-input'

const Create = () => {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [categories, setCategories] = useState([])
    const [isPending, setIsPending] = useState(false)
    const history = useHistory();
    const [images, setImages] = useState([])
    const [imShow, setImShow] = useState([])
    const chipRef = useRef(null)
    const handleFileChange = async (e) => {

        let blobs = e.target.files
        let imageTemp = []
        let imShowTemp = []
        for (let i = 0; i < blobs.length; i++) {
            imageTemp.push(blobs[i])
            imShowTemp.push(URL.createObjectURL(blobs[i]))
            console.log(URL.createObjectURL(blobs[i]))
        }
        setImages(imageTemp)
        setImShow(imShowTemp)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        var form_data = new FormData();
        form_data.append('name', name)
        form_data.append('price', price)
        form_data.append('categories', categories)
        form_data.append('description', description)

        images.forEach(image => {
            form_data.append('images', image);
        });

        console.log(form_data)
        if (isPending) return
        setIsPending(true)
        fetch('/data/products/create', {
            method: "POST",
            body: form_data
        }).then(response =>
            response.json().then(data => ({
                data: data,
                status: response.status
            })
            ).then(res => {
                setIsPending(false)
                console.log(res, res.data)
                // if (res.data.success) {
                //     history.push("/")
                //     history.go()
                // }
                // else console.log(res.data.error)
            }));

    }

    return (<div className="create">
        <h2>Add a New Product</h2>
        {imShow &&
            <Carousel >
                {imShow.map((img, i) =>
                    <Image key={i}
                        onClick={() => console.log('onClick')}
                        src={img}
                        aspectRatio={(16 / 9)} />)
                }
            </Carousel>
        }

        <form onSubmit={(e) => handleSubmit(e)}>
            <div className="create-input">
                <label for="myfile">Select Images</label>
                <input multiple type="file" id="myfile" name="myfile" onChange={handleFileChange} />

                <label>Name:</label>
                <input type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <label>Price in Tk</label>
                <input type="number"
                    required
                    value={price}
                    onChange={(e) => {
                        if (e.target.valueAsNumber >= 0)
                            setPrice(e.target.valueAsNumber)
                    }}
                />
                <label>Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required>
                </textarea>
            </div>

            <label style={{ marginTop: "5%" }}>Categories</label>
            <ChipInput
                style={{ width: "100%", marginTop: "5%", marginBottom: "10%" }}
                ref={chipRef}
                value={categories}
                newChipKeyCodes={[32]}
                onAdd={(chip) => {
                    categories.push(chip);
                    setCategories(categories);
                    console.log(categories);
                }}
                onDelete={(chip, index) => {
                    categories.splice(index, 1);
                    setCategories(categories);
                    chipRef.current.focus()
                }}
            />
            {!isPending && (<button > Add Product</button>)}
            {isPending && (<button > Adding Product</button>)}
        </form>
    </div >);
}

export default Create;