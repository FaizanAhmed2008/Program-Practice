#include <iostream>
using namespace std;

int main() {

    int arr[]={7,5,4,2,6,8,9};
    int size = sizeof(arr)/sizeof(arr[0]);

    for(int i =0 ; i<size-1 ; i++){
        int smallest = i;
        for(int j=0 ; j< size ;j++){
            if(arr[j]<arr[smallest]){
                smallest = j;
            }
        }
        swap(arr[smallest],arr[i]);
    }


    for(int i = 0 ; i < size ; i++){
        cout<<arr[i]<<" ";
    }
    return 0;
}