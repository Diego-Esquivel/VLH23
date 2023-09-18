#undef UNICODE

#define WIN32_LEAN_AND_MEAN

#include <windows.h>
#include <locationapi.h>
#include <sensorsapi.h>
#include <sensors.h>
#include <stdlib.h>
#include <stdio.h>
#include <iostream>
#include <string>
#include <atlbase.h>
#include <fstream>
int main(){
    ILocation* spLocation = (ILocation*) malloc(sizeof(ILocation));
    CComPtr<ILocationReport> spLocationReport; // This is our location report object
    CComPtr<ILatLongReport> spLatLongReport; // This is our LatLong report object

    // Get the current latitude/longitude location report,
    HRESULT hr = spLocation->GetReport(IID_ILatLongReport, &spLocationReport);
    // then get a pointer to the ILatLongReport interface by calling QueryInterface
    if (SUCCEEDED(hr))
    {
        hr = spLocationReport->QueryInterface(&spLatLongReport);
        //PROPVARIANT pv;				
        //hr = spLatLongReport->GetValue(SENSOR_DATA_TYPE_LATITUDE_DEGREES, &pv);
    }
    std::string output = "Hello wrld";
    std::cout << output << std::endl;
    return 0;
}