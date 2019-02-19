const getBiddingSectionTemplate = function() {
  return `
    <div>
      INITIAL BID AMOUNT :
          <span id="current-bid-amount"></span>
    </div>
    <div ><span class="increase-bid">INCREASED BID : <span id="bid-amount"></span> &nbsp</span><button id="increase_bid" onclick = 'increaseBid()'>&#x2b</button>&nbsp<button>MAKE BID</button>&nbsp<button>PASS</button></div>
  `;
};

const getResourceMarketTemplate = function() {
  return `
  <div class="resource-grid">
    <div class="cost">1</div>
    <div class="resource">
      <div id="coal_1_2"></div>
    </div>
    <div class="resource">
      <div id="coal_1_1"></div>
    </div>
    <div class="resource">
      <div id="coal_1_0"></div>
    </div>
    <div class="resource middle-resource">
      <div id="oil_1_2"></div>
    </div>
    <div class="resource middle-resource">
      <div id="oil_1_1"></div>
    </div>
    <div class="resource middle-resource">
      <div id="oil_1_0"></div>
    </div>
    <div class="resource middle-resource">
      <div id="uranium_1_0"></div>
    </div>
    <div class="resource">
      <div id="garbage_1_2"></div>
    </div>
    <div class="resource">
      <div id="garbage_1_1"></div>
    </div>
    <div class="resource">
      <div id="garbage_1_0"></div>
    </div>
  </div>
  <div class="resource-grid">
    <div class="cost">2</div>
    <div class="resource">
      <div id="coal_2_2"></div>
    </div>
    <div class="resource">
      <div id="coal_2_1"></div>
    </div>
    <div class="resource">
      <div id="coal_2_0"></div>
    </div>
    <div class="resource middle-resource">
      <div id="oil_2_2"></div>
    </div>
    <div class="resource middle-resource">
      <div id="oil_2_1"></div>
    </div>
    <div class="resource middle-resource">
      <div id="oil_2_0"></div>
    </div>
    <div class="resource middle-resource">
      <div id="uranium_2_0"></div>
    </div>
    <div class="resource">
      <div id="garbage_2_2"></div>
    </div>
    <div class="resource">
      <div id="garbage_2_1"></div>
    </div>
    <div class="resource">
      <div id="garbage_2_0"></div>
    </div>
  </div>
  <div class="resource-grid">
    <div class="cost">3</div>
    <div class="resource">
      <div id="coal_3_2"></div>
    </div>
    <div class="resource">
      <div id="coal_3_1"></div>
    </div>
    <div class="resource">
      <div id="coal_3_0"></div>
    </div>
    <div class="resource middle-resource">
      <div id="oil_3_2"></div>
    </div>
    <div class="resource middle-resource">
      <div id="oil_3_1"></div>
    </div>
    <div class="resource middle-resource">
      <div id="oil_3_0"></div>
    </div>
    <div class="resource middle-resource">
      <div id="uranium_3_0"></div>
    </div>
    <div class="resource">
      <div id="garbage_3_2"></div>
    </div>
    <div class="resource">
      <div id="garbage_3_1"></div>
    </div>
    <div class="resource">
      <div id="garbage_3_0"></div>
    </div>
  </div>
  <div class="resource-grid">
    <div class="cost">4</div>
    <div class="resource">
      <div id="coal_4_2"></div>
    </div>
    <div class="resource">
      <div id="coal_4_1"></div>
    </div>
    <div class="resource">
      <div id="coal_4_0"></div>
    </div>
    <div class="resource middle-resource">
      <div id="oil_4_2"></div>
    </div>
    <div class="resource middle-resource">
      <div id="oil_4_1"></div>
    </div>
    <div class="resource middle-resource">
      <div id="oil_4_0"></div>
    </div>
    <div class="resource middle-resource">
      <div id="uranium_4_0"></div>
    </div>
    <div class="resource">
      <div id="garbage_4_2"></div>
    </div>
    <div class="resource">
      <div id="garbage_4_1"></div>
    </div>
    <div class="resource">
      <div id="garbage_4_0"></div>
    </div>
  </div>
  <div class="resource-grid">
    <div class="cost">5</div>
    <div class="resource">
      <div id="coal_5_2"></div>
    </div>
    <div class="resource">
      <div id="coal_5_1"></div>
    </div>
    <div class="resource">
      <div id="coal_5_0"></div>
    </div>
    <div class="resource middle-resource">
      <div id="oil_5_2"></div>
    </div>
    <div class="resource middle-resource">
      <div id="oil_5_1"></div>
    </div>
    <div class="resource middle-resource">
      <div id="oil_5_0"></div>
    </div>
    <div class="resource middle-resource">
      <div id="uranium_5_0"></div>
    </div>
    <div class="resource">
      <div id="garbage_5_2"></div>
    </div>
    <div class="resource">
      <div id="garbage_5_1"></div>
    </div>
    <div class="resource">
      <div id="garbage_5_0"></div>
    </div>
  </div>
  <div class="resource-grid">
    <div class="cost">6</div>
    <div class="resource">
      <div id="coal_6_2"></div>
    </div>
    <div class="resource">
      <div id="coal_6_1"></div>
    </div>
    <div class="resource">
      <div id="coal_6_0"></div>
    </div>
    <div class="resource middle-resource">
      <div id="oil_6_2"></div>
    </div>
    <div class="resource middle-resource">
      <div id="oil_6_1"></div>
    </div>
    <div class="resource middle-resource">
      <div id="oil_6_0"></div>
    </div>
    <div class="resource middle-resource">
      <div id="uranium_6_0"></div>
    </div>
    <div class="resource">
      <div id="garbage_6_2"></div>
    </div>
    <div class="resource">
      <div id="garbage_6_1"></div>
    </div>
    <div class="resource">
      <div id="garbage_6_0"></div>
    </div>
  </div>
  <div class="resource-grid">
    <div class="cost">7</div>
    <div class="resource">
      <div id="coal_7_2"></div>
    </div>
    <div class="resource">
      <div id="coal_7_1"></div>
    </div>
    <div class="resource">
      <div id="coal_7_0"></div>
    </div>
    <div class="resource middle-resource">
      <div id="oil_7_2"></div>
    </div>
    <div class="resource middle-resource">
      <div id="oil_7_1"></div>
    </div>
    <div class="resource middle-resource">
      <div id="oil_7_0"></div>
    </div>
    <div class="resource middle-resource">
      <div id="uranium_7_0"></div>
    </div>
    <div class="resource">
      <div id="garbage_7_2"></div>
    </div>
    <div class="resource">
      <div id="garbage_7_1"></div>
    </div>
    <div class="resource">
      <div id="garbage_7_0"></div>
    </div>
  </div>
  <div class="resource-grid">
    <div class="cost">8</div>
    <div class="resource">
      <div id="coal_8_2"></div>
    </div>
    <div class="resource">
      <div id="coal_8_1"></div>
    </div>
    <div class="resource">
      <div id="coal_8_0"></div>
    </div>
    <div class="resource middle-resource">
      <div id="oil_8_2"></div>
    </div>
    <div class="resource middle-resource">
      <div id="oil_8_1"></div>
    </div>
    <div class="resource middle-resource">
      <div id="oil_8_0"></div>
    </div>
    <div class="resource middle-resource">
      <div id="uranium_8_0"></div>
    </div>
    <div class="resource">
      <div id="garbage_8_2"></div>
    </div>
    <div class="resource">
      <div id="garbage_8_1"></div>
    </div>
    <div class="resource">
      <div id="garbage_8_0"></div>
    </div>
  </div>
  <div class="resource-grid">
    <div class="last-uranium">
      <div class="uranium-cost">10</div>
      <div id="uranium_10_0"></div>
    </div>
    <div class="last-uranium">
      <div class="uranium-cost">12</div>
      <div id="uranium_12_0"></div>
    </div>
    <div class="last-uranium">
      <div class="uranium-cost">14</div>
      <div id="uranium_14_0"></div>
    </div>
    <div class="last-uranium">
      <div class="uranium-cost">16</div>
      <div id="uranium_16_0"></div>
    </div>
  </div>
`;
};
