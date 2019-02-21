const getBiddingSectionTemplate = function() {
  return `
    <div>
      INITIAL BID AMOUNT :
          <span id="current-bid-amount"></span>
    </div>
    <div ><span class="increase-bid">INCREASED BID : 
    <span id="bid-amount"></span> &nbsp</span>
    <button id="increase_bid" onclick = 'increaseBid()'>&#x2b</button>&nbsp
    <button>MAKE BID</button>&nbsp<button onclick = "displayMap()">MAP</button>
    <button onclick = "startBuyingResources() ">Start Buying Resources</button>
    <div id="selected-resource-amount" style="visibility:hidden">
    Selected Resource Amount : <span id="resource-amount">0</span>
    <button>Buy Resources</button></div></div>
  `;
};

const getResourceMarketTemplate = function() {
  return `
  <div class="resource-grid">
    <div class="cost">1</div>
    <div class="resource" id="Coal_1_2">
    </div>
    <div class="resource" id="Coal_1_1">
    </div>
    <div class="resource" id="Coal_1_0">
    </div>
    <div class="resource middle-resource" id="Oil_1_2">
    </div>
    <div class="resource middle-resource" id="Oil_1_1">
    </div>
    <div class="resource middle-resource" id="Oil_1_0">
    </div>
    <div class="resource middle-resource" id="Uranium_1_0">
    </div>
    <div class="resource" id="Garbage_1_2">
    </div>
    <div class="resource" id="Garbage_1_1">
    </div>
    <div class="resource" id="Garbage_1_0">
    </div>
  </div>
  <div class="resource-grid">
    <div class="cost">2</div>
    <div class="resource" id="Coal_2_2">
    </div>
    <div class="resource" id="Coal_2_1">
    </div>
    <div class="resource" id="Coal_2_0">
    </div>
    <div class="resource middle-resource" id="Oil_2_2">
    </div>
    <div class="resource middle-resource" id="Oil_2_1">
    </div>
    <div class="resource middle-resource" id="Oil_2_0">
    </div>
    <div class="resource middle-resource" id="Uranium_2_0">
    </div>
    <div class="resource" id="Garbage_2_2">
    </div>
    <div class="resource" id="Garbage_2_1">
    </div>
    <div class="resource" id="Garbage_2_0">
    </div>
  </div>
  <div class="resource-grid">
    <div class="cost">3</div>
    <div class="resource" id="Coal_3_2">
    </div>
    <div class="resource" id="Coal_3_1">
    </div>
    <div class="resource" id="Coal_3_0">
    </div>
    <div class="resource middle-resource" id="Oil_3_2">
    </div>
    <div class="resource middle-resource" id="Oil_3_1">
    </div>
    <div class="resource middle-resource" id="Oil_3_0">
    </div>
    <div class="resource middle-resource" id="Uranium_3_0">
    </div>
    <div class="resource" id="Garbage_3_2">
    </div>
    <div class="resource" id="Garbage_3_1">
    </div>
    <div class="resource" id="Garbage_3_0">
    </div>
  </div>
  <div class="resource-grid">
    <div class="cost">4</div>
    <div class="resource" id="Coal_4_2">
    </div>
    <div class="resource" id="Coal_4_1">
    </div>
    <div class="resource" id="Coal_4_0">
    </div>
    <div class="resource middle-resource" id="Oil_4_2">
    </div>
    <div class="resource middle-resource" id="Oil_4_1">
    </div>
    <div class="resource middle-resource" id="Oil_4_0">
    </div>
    <div class="resource middle-resource" id="Uranium_4_0">
    </div>
    <div class="resource" id="Garbage_4_2">
    </div>
    <div class="resource" id="Garbage_4_1">
    </div>
    <div class="resource" id="Garbage_4_0">
    </div>
  </div>
  <div class="resource-grid">
    <div class="cost">5</div>
    <div class="resource" id="Coal_5_2">
    </div>
    <div class="resource" id="Coal_5_1">
    </div>
    <div class="resource" id="Coal_5_0">
    </div>
    <div class="resource middle-resource" id="Oil_5_2">
    </div>
    <div class="resource middle-resource" id="Oil_5_1">
    </div>
    <div class="resource middle-resource" id="Oil_5_0">
    </div>
    <div class="resource middle-resource" id="Uranium_5_0">
    </div>
    <div class="resource" id="Garbage_5_2">
    </div>
    <div class="resource" id="Garbage_5_1">
    </div>
    <div class="resource" id="Garbage_5_0">
    </div>
  </div>
  <div class="resource-grid">
    <div class="cost">6</div>
    <div class="resource" id="Coal_6_2">
    </div>
    <div class="resource" id="Coal_6_1">
    </div>
    <div class="resource" id="Coal_6_0">
    </div>
    <div class="resource middle-resource" id="Oil_6_2">
    </div>
    <div class="resource middle-resource" id="Oil_6_1">
    </div>
    <div class="resource middle-resource" id="Oil_6_0">
    </div>
    <div class="resource middle-resource" id="Uranium_6_0">
    </div>
    <div class="resource" id="Garbage_6_2">
    </div>
    <div class="resource" id="Garbage_6_1">
    </div>
    <div class="resource" id="Garbage_6_0">
    </div>
  </div>
  <div class="resource-grid">
    <div class="cost">7</div>
    <div class="resource" id="Coal_7_2">
    </div>
    <div class="resource" id="Coal_7_1">
    </div>
    <div class="resource" id="Coal_7_0">
    </div>
    <div class="resource middle-resource" id="Oil_7_2">
    </div>
    <div class="resource middle-resource" id="Oil_7_1">
    </div>
    <div class="resource middle-resource" id="Oil_7_0">
    </div>
    <div class="resource middle-resource" id="Uranium_7_0">
    </div>
    <div class="resource" id="Garbage_7_2">
    </div>
    <div class="resource" id="Garbage_7_1">
    </div>
    <div class="resource" id="Garbage_7_0">
    </div>
  </div>
  <div class="resource-grid">
    <div class="cost">8</div>
    <div class="resource" id="Coal_8_2">
    </div>
    <div class="resource" id="Coal_8_1">
    </div>
    <div class="resource" id="Coal_8_0">
    </div>
    <div class="resource middle-resource" id="Oil_8_2">
    </div>
    <div class="resource middle-resource" id="Oil_8_1">
    </div>
    <div class="resource middle-resource" id="Oil_8_0">
    </div>
    <div class="resource middle-resource" id="Uranium_8_0">
    </div>
    <div class="resource" id="Garbage_8_2">
    </div>
    <div class="resource" id="Garbage_8_1">
    </div>
    <div class="resource" id="Garbage_8_0"></div>
  </div>
  <div class="resource-grid">
    <div class="last-uranium" id="Uranium_10_0">
    <div class = "uranium-cost">10</div>
    </div>
    <div class="last-uranium" id="Uranium_12_0">
    <div class = "uranium-cost">12</div>
    </div>
    <div class="last-uranium" id="Uranium_14_0">
    <div class = "uranium-cost">14</div>
    </div>
    <div class="last-uranium" id="Uranium_16_0">
    <div class = "uranium-cost">16</div>
    </div>
  </div>
`;
};