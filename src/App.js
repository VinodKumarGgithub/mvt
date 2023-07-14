import React, { useEffect, useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Input,
  FormLabel,
  Box,
  Text,
  Center,
} from '@chakra-ui/react'
import './App.css'

const RevenueAggregator = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filter, setFilter] = useState('');
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await fetch('http://localhost:3000/products1');
        const branch1Data = await response1.json();

        const response2 = await fetch('http://localhost:3000/products2');
        const branch2Data = await response2.json();

        const response3 = await fetch('http://localhost:3000/products3');
        const branch3Data = await response3.json();


        // Combine The data from all branches
        const combinedData = [...branch1Data, ...branch2Data, ...branch3Data];

        // Merge and sum The revenue for The same products
        const AllProducts = [];
        combinedData.forEach((product) => {
          const existingProdIndex = AllProducts.findIndex(
            (p) => p.name === product.name
          );

          if (existingProdIndex !== -1) {
            AllProducts[existingProdIndex].sold +=product.sold;
          } else {
            AllProducts.push(product);
          }
        });

        // Sort The products alphabetically by name
        AllProducts.sort((a, b) => a.name.localeCompare(b.name));

        setProducts(AllProducts);
        setFilteredProducts(AllProducts);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Filter products based on The filter text
    const filtered = products.filter((product) =>
      product.name.toLowerCase()
      .includes(filter.toLowerCase())
    );
    setFilteredProducts(filtered);
    
      const total = filtered.reduce((total, product) => total + product.unitPrice*product.sold, 0);
      setTotalRevenue(Number.parseInt(total));
    
  }, [filter, products]);


  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    console.log(e.target.value,'sdcsd');
    // formatNumber()
  };

 

  return (
    <div>
     <Box  w='80%'  m='auto' my='2em'>
      <label style={{fontWeight:'bold', opacity:'0.5'}}>Filter by Name :</label>
       <Input type="text" placeholder='Search by product name' id="filter" value={filter} onChange={handleFilterChange} w='sm' size='md' ml='1em'  />
     
     </Box>
      <TableContainer className='mvt_table' w='80%' m='auto' borderRadius='md' py='1em' px='1.1em'>
      <Table variant='striped' colorScheme='teal' >
        <Thead>
          <Tr>
            <Th>Product Name</Th>
            <Th>Total Revenue</Th>
          </Tr>
        </Thead>
        <Tbody>
          {
           filteredProducts.map((product,i) => (
            <Tr key={product.name}>
              <Td>{product.name}</Td>
              <Td>{Number.parseInt(product.unitPrice*product.sold)}</Td>
            </Tr>
          )) 
          }
        </Tbody>
        <Tfoot>
          <Tr>
            <Th>Total Revenue:</Th>
            <Th>{totalRevenue}</Th>
          </Tr>
        </Tfoot>
      </Table>
      </TableContainer>
    </div>
  );
};

export default RevenueAggregator;
