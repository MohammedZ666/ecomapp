import useFetch from './useFetch';
import TextField from '@material-ui/core/TextField';
import { useState } from 'react';
import { useEffect } from 'react';
import ProductList from './ProductList';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import DoneIcon from '@material-ui/icons/Done';
const query = '/data/products/'
const Home = () => {
    const [queryString, setQueryString] = useState("")
    let { data, isPending, error } = useFetch(query+queryString);
    const [products, setProducts] = useState(null)
    const [categories, setCategories] = useState([])
    const [chipSelected, setChipSelected] = useState(null)
    const [isNoResult, setNoResult] = useState(false)
    const [isFirstLoad, setFirstLoad] = useState(true)
    const [searchText, setSearchText] = useState("")
    
    useEffect(() => {
        if (data) {
            if(data.productList.length===0)setNoResult(true)
            else setNoResult(false)
            setProducts(data.productList)
            setCategories(data.categories)
            if(isFirstLoad){
            
                let chipSelTemp = Array(data.categories.length)
                for (let i = 0; i < chipSelTemp.length; i++) {
                    chipSelTemp[i] = false
                }
                setChipSelected(chipSelTemp)
            }
        }
    }, [data, isFirstLoad])
      
    const filterData = (queryWords) => {
        console.log(queryWords)
        let queryJson = {
            keywords: queryWords
        }
        let searchString = "";
         if(queryWords.length>0) searchString = "?"+(new URLSearchParams(queryJson).toString())
        setQueryString(searchString)
        setFirstLoad(false)
    }
    
    const handleChange = (text) => {
        let queryWords = []
        chipSelected.forEach((clicked, i) => {
            if (clicked) queryWords.push(categories[i])
        })
        if(text)
            queryWords.push(...((text).trim().toLowerCase().split(" ")))      
        filterData(queryWords) 
    }
    return (
        <div className="home">
            <div className="search-bar">
                <TextField onChange={(e) => {
                    handleChange(e.target.value)
                    setSearchText(e.target.value)
                }}
                    value={searchText}
                    color="secondary"
                    id="filled-basic"
                    label="search products"
                    variant="filled" />
            </div>
            { categories && <div style={{
                margin: "4% auto 4% auto",
                width: "50%",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                /* this */

            }}>
                {categories.map((category, i) => (

                    <Chip style={{
                        marginLeft: "1%",
                        marginRight: "1%"
                    }}
                        label={<span style={{
                            color: "white"
                        }}>
                            {category}
                        </span>}
                        onClick={() => {

                            let chipSelTemp = [...chipSelected]
                            chipSelTemp[i] = !chipSelTemp[i]
                            let queryWords = []
                            chipSelTemp.forEach((clicked, i) => {
                              if (clicked) queryWords.push(categories[i])
                             })
                            if(searchText.trim() ===! ""){
                                queryWords.push(...searchText.split(" "))
                            }
                            filterData(queryWords)
                            setChipSelected(chipSelTemp)
                        }}
                        avatar={chipSelected[i] ?
                            <Avatar style={{ backgroundColor: "white" }}
                            ><DoneIcon style={{ color: "white" }} />
                            </Avatar>
                            :
                            null}
                        variant="default"
                        clickable
                        color="secondary"
                    />
                ))}

            </div>}
            {error && <div>{error}</div>}
            {isPending && <div>Loading...</div>}
            {isNoResult && <div>No Matches found. Try something different.</div>}
            {products && <ProductList products={products} categories={data.categories} />}
            {/* {<ProductList />} */}
        </div>
    );
}

export default Home;