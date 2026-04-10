#include <iostream>
#include <vector>
#include <string>
#include <queue>
#include <unordered_map>
#include <map>
#include <set>
#include <algorithm>
#include <memory>
#include <sstream>
#include <iomanip>
#include <numeric>

using namespace std;

struct RouteResult {
    vector<string> path;
    int totalDistance;
};

class NaviRouteService {
private:
    unordered_map<string, vector<pair<string, int>>> graph;

public:
    NaviRouteService() {
        addRoad("Mumbai", "Pune", 150);
        addRoad("Mumbai", "Ahmedabad", 530);
        addRoad("Mumbai", "Hyderabad", 710);
        addRoad("Delhi", "Jaipur", 280);
        addRoad("Delhi", "Bhopal", 740);
        addRoad("Delhi", "Kolkata", 1470);
        addRoad("Jaipur", "Ahmedabad", 660);
        addRoad("Jaipur", "Bhopal", 580);
        addRoad("Bhopal", "Hyderabad", 700);
        addRoad("Bhopal", "Kolkata", 1060);
        addRoad("Hyderabad", "Bangalore", 570);
        addRoad("Hyderabad", "Chennai", 630);
        addRoad("Bangalore", "Chennai", 345);
        addRoad("Kolkata", "Chennai", 1660);
        addRoad("Pune", "Hyderabad", 560);
        addRoad("Ahmedabad", "Bhopal", 520);
    }

    void addRoad(const string& u, const string& v, int w) {
        graph[u].push_back({v, w});
        graph[v].push_back({u, w});
    }

    RouteResult findShortestRoute(const string& src, const string& dst) {
        unordered_map<string, int> dist;
        unordered_map<string, string> parent;
        for (auto& node : graph) dist[node.first] = 1e9;
        dist[src] = 0;

        using P = pair<int, string>;
        priority_queue<P, vector<P>, greater<P>> pq;
        pq.push({0, src});

        while (!pq.empty()) {
            auto [d, u] = pq.top();
            pq.pop();
            if (d > dist[u]) continue;

            for (auto& [v, w] : graph[u]) {
                if (dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    parent[v] = u;
                    pq.push({dist[v], v});
                }
            }
        }

        vector<string> path;
        if (dist[dst] == 1e9) return {{}, -1};

        string cur = dst;
        while (cur != src) {
            path.push_back(cur);
            cur = parent[cur];
        }
        path.push_back(src);
        reverse(path.begin(), path.end());

        return {path, dist[dst]};
    }
};

struct Order {
    string id;
    string item;
    double weight;
    int value;
    string priority;
};

class PackSortService {
private:
    static bool compareByValue(const Order& a, const Order& b) {
        return a.value < b.value;
    }

    static bool compareByWeight(const Order& a, const Order& b) {
        return a.weight < b.weight;
    }

    void merge(vector<Order>& arr, int l, int m, int r, bool byValue) {
        vector<Order> left(arr.begin() + l, arr.begin() + m + 1);
        vector<Order> right(arr.begin() + m + 1, arr.begin() + r + 1);

        int i = 0, j = 0, k = l;
        while (i < (int)left.size() && j < (int)right.size()) {
            bool cond = byValue ? compareByValue(left[i], right[j]) : compareByWeight(left[i], right[j]);
            if (cond) arr[k++] = left[i++];
            else arr[k++] = right[j++];
        }

        while (i < (int)left.size()) arr[k++] = left[i++];
        while (j < (int)right.size()) arr[k++] = right[j++];
    }

    void mergeSort(vector<Order>& arr, int l, int r, bool byValue) {
        if (l >= r) return;
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m, byValue);
        mergeSort(arr, m + 1, r, byValue);
        merge(arr, l, m, r, byValue);
    }

public:
    vector<Order> sortOrders(vector<Order> orders, const string& key) {
        if (orders.empty()) return orders;
        bool byValue = (key == "value");
        mergeSort(orders, 0, (int)orders.size() - 1, byValue);
        return orders;
    }
};

struct HuffmanNode {
    char ch;
    int freq;
    HuffmanNode* left;
    HuffmanNode* right;

    HuffmanNode(char c, int f) : ch(c), freq(f), left(nullptr), right(nullptr) {}
    HuffmanNode(int f, HuffmanNode* l, HuffmanNode* r) : ch('\0'), freq(f), left(l), right(r) {}
};

struct HuffmanCompare {
    bool operator()(HuffmanNode* a, HuffmanNode* b) {
        return a->freq > b->freq;
    }
};

struct CompressionResult {
    unordered_map<char, string> codes;
    string encoded;
    int originalBits;
    int compressedBits;
};

class ZipItService {
private:
    void buildCodes(HuffmanNode* root, const string& code, unordered_map<char, string>& codes) {
        if (!root) return;
        if (!root->left && !root->right) {
            codes[root->ch] = code.empty() ? "0" : code;
            return;
        }
        buildCodes(root->left, code + "0", codes);
        buildCodes(root->right, code + "1", codes);
    }

    void cleanup(HuffmanNode* root) {
        if (!root) return;
        cleanup(root->left);
        cleanup(root->right);
        delete root;
    }

public:
    CompressionResult compress(const string& text) {
        unordered_map<char, int> freq;
        for (char c : text) freq[c]++;

        priority_queue<HuffmanNode*, vector<HuffmanNode*>, HuffmanCompare> pq;
        for (auto& [ch, f] : freq) pq.push(new HuffmanNode(ch, f));

        while (pq.size() > 1) {
            HuffmanNode* a = pq.top(); pq.pop();
            HuffmanNode* b = pq.top(); pq.pop();
            pq.push(new HuffmanNode(a->freq + b->freq, a, b));
        }

        HuffmanNode* root = pq.top();
        unordered_map<char, string> codes;
        buildCodes(root, "", codes);

        string encoded;
        for (char c : text) encoded += codes[c];

        CompressionResult result;
        result.codes = codes;
        result.encoded = encoded;
        result.originalBits = (int)text.size() * 8;
        result.compressedBits = (int)encoded.size();

        cleanup(root);
        return result;
    }
};

struct DiffResult {
    int lcsLength;
    int additions;
    int deletions;
    int similarity;
    vector<string> commonLines;
};

class DiffScanService {
public:
    DiffResult analyze(const vector<string>& A, const vector<string>& B) {
        int m = (int)A.size(), n = (int)B.size();
        vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (A[i - 1] == B[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
                else dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
            }
        }

        vector<string> lcs;
        int i = m, j = n;
        while (i > 0 && j > 0) {
            if (A[i - 1] == B[j - 1]) {
                lcs.push_back(A[i - 1]);
                i--;
                j--;
            } else if (dp[i - 1][j] >= dp[i][j - 1]) {
                i--;
            } else {
                j--;
            }
        }
        reverse(lcs.begin(), lcs.end());

        int adds = n - dp[m][n];
        int dels = m - dp[m][n];
        int similarity = (m + n == 0) ? 100 : (2 * dp[m][n] * 100) / (m + n);

        return {dp[m][n], adds, dels, similarity, lcs};
    }
};

struct NetworkEdge {
    string u;
    string v;
    int cost;
};

struct MSTResult {
    vector<NetworkEdge> mst;
    int totalCost;
};

class DisjointSet {
private:
    unordered_map<string, string> parent;
    unordered_map<string, int> rankMap;

public:
    void makeSet(const vector<string>& nodes) {
        for (const string& node : nodes) {
            parent[node] = node;
            rankMap[node] = 0;
        }
    }

    string find(const string& x) {
        if (parent[x] == x) return x;
        return parent[x] = find(parent[x]);
    }

    bool unite(const string& a, const string& b) {
        string pa = find(a), pb = find(b);
        if (pa == pb) return false;

        if (rankMap[pa] < rankMap[pb]) parent[pa] = pb;
        else if (rankMap[pa] > rankMap[pb]) parent[pb] = pa;
        else {
            parent[pb] = pa;
            rankMap[pa]++;
        }
        return true;
    }
};

class NetSpanService {
private:
    vector<string> offices = {"HQ", "DataCenter", "North", "East", "South", "West", "CentralHub"};
    vector<NetworkEdge> edges = {
        {"HQ","DataCenter",12},
        {"HQ","West",8},
        {"HQ","CentralHub",10},
        {"DataCenter","North",6},
        {"DataCenter","CentralHub",9},
        {"DataCenter","East",15},
        {"North","East",7},
        {"CentralHub","South",11},
        {"CentralHub","East",13},
        {"West","South",14},
        {"East","South",5}
    };

public:
    MSTResult planNetwork() {
        vector<NetworkEdge> sortedEdges = edges;
        sort(sortedEdges.begin(), sortedEdges.end(), [](const NetworkEdge& a, const NetworkEdge& b) {
            return a.cost < b.cost;
        });

        DisjointSet ds;
        ds.makeSet(offices);

        vector<NetworkEdge> mst;
        int total = 0;

        for (const auto& edge : sortedEdges) {
            if (ds.unite(edge.u, edge.v)) {
                mst.push_back(edge);
                total += edge.cost;
            }
        }

        return {mst, total};
    }
};

struct ScheduleResult {
    vector<int> positions;
    bool success;
};

class ShiftBoardService {
private:
    bool isSafe(const vector<int>& board, int row, int col) {
        for (int i = 0; i < row; i++) {
            if (board[i] == col || abs(board[i] - col) == abs(i - row)) return false;
        }
        return true;
    }

    bool solve(vector<int>& board, int row, int n) {
        if (row == n) return true;
        for (int col = 0; col < n; col++) {
            if (isSafe(board, row, col)) {
                board[row] = col;
                if (solve(board, row + 1, n)) return true;
                board[row] = -1;
            }
        }
        return false;
    }

public:
    ScheduleResult generateSchedule(int n) {
        vector<int> board(n, -1);
        bool ok = solve(board, 0, n);
        return {board, ok};
    }
};

class DAABackendSystem {
private:
    NaviRouteService routeService;
    PackSortService sortService;
    ZipItService zipService;
    DiffScanService diffService;
    NetSpanService networkService;
    ShiftBoardService shiftService;

public:
    void demoNaviRoute() {
        auto result = routeService.findShortestRoute("Mumbai", "Delhi");
        cout << "\nNaviRoute Output\n";
        cout << "Shortest Path: ";
        for (int i = 0; i < (int)result.path.size(); i++) {
            cout << result.path[i];
            if (i + 1 < (int)result.path.size()) cout << " -> ";
        }
        cout << "\nTotal Distance: " << result.totalDistance << " km\n";
    }

    void demoPackSort() {
        vector<Order> orders = {
            {"#A1042","Laptop Pro",2.1,85000,"Express"},
            {"#A1043","Wireless Buds",0.2,3500,"Standard"},
            {"#A1044","4K Monitor",7.5,32000,"Express"},
            {"#A1045","Keyboard",0.8,2800,"Standard"},
            {"#A1046","Mechanical Watch",0.1,120000,"Express"}
        };

        auto sorted = sortService.sortOrders(orders, "value");
        cout << "\nPackSort Output\n";
        for (const auto& order : sorted) {
            cout << order.id << " | " << order.item << " | " << order.value << "\n";
        }
    }

    void demoZipIt() {
        string text = "HELLO WORLD";
        auto result = zipService.compress(text);

        cout << "\nZipIt Output\n";
        cout << "Original Bits: " << result.originalBits << "\n";
        cout << "Compressed Bits: " << result.compressedBits << "\n";
        cout << "Encoded String: " << result.encoded << "\n";
        cout << "Codes:\n";
        for (auto& [ch, code] : result.codes) {
            cout << "'" << ch << "' -> " << code << "\n";
        }
    }

    void demoDiffScan() {
        vector<string> A = {
            "function authenticate(user, pass) {",
            "  const hash = md5(pass);",
            "  return true;",
            "}"
        };

        vector<string> B = {
            "async function authenticate(user, pass, mfa) {",
            "  const hash = bcrypt.hash(pass, 12);",
            "  return true;",
            "}"
        };

        auto result = diffService.analyze(A, B);

        cout << "\nDiffScan Output\n";
        cout << "LCS Length: " << result.lcsLength << "\n";
        cout << "Additions: " << result.additions << "\n";
        cout << "Deletions: " << result.deletions << "\n";
        cout << "Similarity: " << result.similarity << "%\n";
        cout << "Common Lines:\n";
        for (const auto& line : result.commonLines) {
            cout << line << "\n";
        }
    }

    void demoNetSpan() {
        auto result = networkService.planNetwork();

        cout << "\nNetSpan Output\n";
        cout << "Minimum Spanning Network:\n";
        for (const auto& edge : result.mst) {
            cout << edge.u << " - " << edge.v << " : " << edge.cost << " Lakhs\n";
        }
        cout << "Total Cost: " << result.totalCost << " Lakhs\n";
    }

    void demoShiftBoard() {
        auto result = shiftService.generateSchedule(6);

        cout << "\nShiftBoard Output\n";
        if (!result.success) {
            cout << "No valid schedule found\n";
            return;
        }

        for (int i = 0; i < (int)result.positions.size(); i++) {
            cout << "Staff " << i + 1 << " -> Shift " << result.positions[i] + 1 << "\n";
        }
    }

    void runAllDemos() {
        demoNaviRoute();
        demoPackSort();
        demoZipIt();
        demoDiffScan();
        demoNetSpan();
        demoShiftBoard();
    }
};

int main() {
    DAABackendSystem system;
    system.runAllDemos();
    return 0;
}