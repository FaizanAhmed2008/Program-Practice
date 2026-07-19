#include <iostream>
using namespace std;

int main(){

    int arr[]={2,5,3,4,1,7,8,6,9};
    int n = 10;

    for(int i =0 ; i<n-1 ; i++){
        for(int j=0 ; j<n-i-1 ;j++){
            if(arr[j]>arr[j+1]){
                swap(arr[j], arr[j+1]);
            }
        }
    }

    for(int i =0 ; i<n ; i++){
        cout<<arr[i]<< " ";
    }
    return 0;

}