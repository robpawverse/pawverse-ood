const OODParser = require("../core/OODParser");

const oodText = `
User( id="user-123" )
  :meta( created_at="2025-03-01T12:00:00Z", role="standard_user" )
  :actions( post_notice(), comment(), rate() )
  :data( display_name="Happy User", location="New York" )
---
Breeder( id="user-456" ) extends User
  :meta( verified="True", verification_date="2025-02-01" )
  :data( available_puppies=5 )
  :actions( highlight_notice(), priority_listing() )
---
Notice( id="notice-001" )
  :meta( created_at="2025-03-02T10:30:00Z", visibility="public" )
  :actions( publish(), archive(), comment() )
  :data( title="Labrador Puppies Available", type="adoption" )
  :relationships( author="user-123" )
---
Comment( id="comment-555" ) extends Notice
  :meta( created_at="2025-03-03T14:00:00Z" )
  :data( content="Great breeder! Highly recommend!" )
  :relationships( author="user-999", notice="notice-001" )
---
PawPoints( id="user-123-credits" ) extends OODObject
  :meta( currency="PawPoints" )
  :actions( purchase(), redeem(), transfer() )
  :data( balance=250 )
`;

const parser = new OODParser();
const objects = parser.parse(oodText);

// ✅ Check Object Types
console.log("\n✅ Checking object types...");
Object.keys(objects).forEach(id => {
    console.log(`🔍 ${id} is instance of OODObject:`, objects[id] instanceof require("../core/OODObject"));
});

// ✅ Verify Inheritance & Actions
console.log("\n✅ Checking inheritance & actions...");
console.log("User Actions:", objects["user-123"]["@actions"]);
console.log("Breeder Actions:", objects["user-456"]["@actions"]);
console.log("Notice Actions:", objects["notice-001"]["@actions"]);
console.log("Comment Actions:", objects["comment-555"]["@actions"]);
console.log("PawPoints Actions:", objects["user-123-credits"]["@actions"]);

// ✅ Verify Relationship Handling
console.log("\n✅ Checking relationships...");
console.log("Notice Author:", objects["notice-001"]["@relationships"]["author"]);
console.log("Comment Notice:", objects["comment-555"]["@relationships"]["notice"]);

// ✅ Verify Format Conversion
["json", "yaml", "xml", "msgpack", "protobuf"].forEach(format => {
    console.log(`✅ Testing ${format.toUpperCase()} Output:`);
    console.log(objects["notice-001"].convertFormat(format));
    console.log("---------------------------------");
});
