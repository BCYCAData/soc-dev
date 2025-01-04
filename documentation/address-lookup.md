# Address Search

To determine the location of an address, follow these steps:

1. **Check if the address is in `public.custom_address`**:
    - If found, use the address from this table.
    - If not found, proceed to the next step.

2. **Check if the address is in `public.project_addresspoints`**:
    - If found, use the address from this table.
    - If not found, proceed to the next step.

3. **Check if the address is an exact match at Geoscape**:
    Use: `process_geoscape_geocoder_response(address_string text)`
    If return is:
    ```json
        {
            "matchType": "exact",
            "formattedAddress": "183 SUNSHINE RD, HILLVILLE NSW 2430",
            "cadastralIdentifier": "DP/22//1220838"
        }
    ```
        - look up the `propid` using the `cadastralIdentifier`. 

    If return is:
    ```json
        {
            "matchType": "neighbour",
            "formattedAddress": "183 SUNSHINE RD, HILLVILLE NSW 2430",
            "cadastralIdentifier": "DP/22//1220838"
        }
    ```
        - handle validated address. 
        - look up the `propid` using the `cadastralIdentifier`. 

    If return is:
    ```json
        {
            "matchType": "noMatch",
            "formattedAddress": null,
            "cadastralIdentifier": null
        }
    ```
        - the address cannot be located. 

4. **Get `principaladdresssiteoid` from SSNSW**
    Use: `get_principaladdresssiteoid_from_cadastralidentifier(cadastral_identifier text)`
    - If return is a valid integer, proceed to the next step.
    - If not, the look up has failed.

5. **Get `AddressPoint` from SSNSW**
    Use: `select * FROM http_get('https://maps.six.nsw.gov.au/arcgis/rest/services/sixmaps/PropertyAddress/MapServer/2/query?where=' || urlencode('AddressPoint.principaladdresssiteoid=4570028') || '&outFields=' || urlencode('AddressPoint.principaladdresssiteoid,addressstring.address,addressstring.suburbname,addressstring.postcode') || '&outSR=7844&f=geojson');`

This decision tree ensures that the address is checked in multiple sources to find the most accurate location.