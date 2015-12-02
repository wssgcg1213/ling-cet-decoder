{
  "targets": [
    {
      "target_name": "cetdecoder-main",
      "sources": [ "cetdecoder-main.cc" ],
      "include_dirs": [ 
          "<!(node -e \"require('nan')\")"
      ]
    }
  ]
}