import React, { useEffect, useState } from 'react';
import './ProductList.scss';
import { deleteProduct, getProducts } from "../../../redux/features/product/productSlice";
//All icons are import from this site from github: https://react-icons.github.io/react-icons/icons/ai/
import { TbEdit } from "react-icons/tb";
import { MdOutlineDelete  } from "react-icons/md";
import { Link } from "react-router-dom";
import Search from '../../search/Search';
import { useDispatch, useSelector } from 'react-redux';
import { FILTER_PRODUCTS, selectFiltered } from '../../../redux/features/product/filterSlice';
//Pagination is imported and applied from this website https://www.npmjs.com/package/react-paginate
import ReactPaginate from 'react-paginate';
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css'; 

/*
Show list of all devices in dashboard
Includes devices and their neccessary infos
Includes search bar, pagination devices
*/ 

const ProductList = ({products, isLoading}) => {

  const [search, setSearch] = useState("")
  const filterProduct = useSelector(selectFiltered)

  const dispatch = useDispatch()

  const shortenText = (text, n) => { 
    if(text.length > n){
      const shortText = text.substring(0,n).concat("...")

      return shortText
    }
    return text;
   }

  const deleteAProduct = async (id) => {
    //Delete a product with its id
    await dispatch(deleteProduct(id))
    //Refresh page after deleting
    await dispatch(getProducts(id))

  }

  //Show popup before deleting
  //Sources: https://www.npmjs.com/package/react-confirm-alert
  const popupDelete = (id) => {
    confirmAlert({
      title: 'Delete device',
      message: 'Are you sure to delete device?',
      buttons: [
        {
          label: 'Delete',
          onClick: () => deleteAProduct(id)
        },
        {
          label: 'Cancel',
        }
      ]
    });
  }

  //Pagination of website
  //Sources: 
  const [itemOffset, setItemOffset] = useState(0);

  const itemsPerPage = 30
  const endOffset = itemOffset + itemsPerPage;
  console.log(`Loading items from ${itemOffset} to ${endOffset}`);
  const currentItems = filterProduct.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(filterProduct.length / itemsPerPage);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % filterProduct.length;

    setItemOffset(newOffset);
  };

  useEffect(() => {
    dispatch(FILTER_PRODUCTS({products, search}))
  }, [products, search, dispatch])

  return (
    <div className='product-list'>
      <hr />
      <div className='table'>
        <div className='--flex-middle --flex-column'>
          <span>
            <h2>All devices</h2>
          </span>
          <span>
            <Search value={search} onChange={(e) => setSearch(e.target.value)} />
          </span>
        </div>

        {isLoading}

        <div className='table'>
        { !isLoading && currentItems.length === 0 ? (
            <p>No device found</p>          
            ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Serial Number</th>
                  <th>Category</th>
                  <th>Inventory Number</th>
                  <th>Warranty until</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  //Show array of all products in screen
                  currentItems.map((product) => {
                    const {_id, name, category, inventorynumber, 
                      serialnumber, guarantee, price, statusDevice} = product;
                    return (
                      <tr key={_id}>
                        <td>{shortenText(name, 16)}</td>
                        <td>
                          {serialnumber}
                        </td>
                        <td>{category}</td>
                        <td>{inventorynumber}</td>
                        <td>{guarantee}</td>
                        <td>{"€"}{price}</td>
                        <td>{statusDevice}</td>
                        <td className="icons">
                       
                          <span>
                            <Link to={`/editproduct/${_id}`}>
                              <TbEdit size={20} color={"#df8600"} />
                            </Link>
                          </span>
                          <span>
                            <MdOutlineDelete 
                              size={20}
                              color={"#c81b1bd2"}
                              onClick={() => popupDelete(_id)}
                            />
                        </span>
                      </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          )}


        </div>
        <ReactPaginate
        breakLabel="..."
        nextLabel="Next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        pageCount={pageCount}
        previousLabel="< Previous"
        renderOnZeroPageCount={null}
        containerClassName="pagination"
        pageLinkClassName="page-num"
        previousLinkClassName="page-num"
        nextLinkClassName="page-num"
        activeLinkClassName="activePage"
      />
      </div>
    </div>
  )
}

export default ProductList