import { Link } from "react-router-dom";
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';


const ProductList = ({ products }) => {

    return (
        <div className="product-list">

            {products.map((product) => (

                <Card className="product-preview" key={product._id} >
                    <Link to={`/products/${product._id}`}>
                        <CardActionArea>
                            <CardMedia
                                style={{ height: 140 }}
                                image={product.images[0]}
                                title={product.name}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    {product.name}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    {product.description}
                                </Typography>
                                <p style={{ marginTop: "1em", fontSize: 20, }}>  <b> ৳ {product.price}</b>  </p>
                            </CardContent>
                        </CardActionArea>
                    </Link>
                </Card>


            ))
            }
        </div >


    );
}
export default ProductList;